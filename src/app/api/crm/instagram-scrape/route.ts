import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { username, maxLeads = 20 }: { username: string; maxLeads?: number } = body

        if (!username) {
            return NextResponse.json({ error: 'Username do Instagram é obrigatório' }, { status: 400 })
        }

        const cleanUsername = username.replace(/^@/, '').trim()

        // Common headers to mimic a browser
        const headers: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.instagram.com/',
            'X-IG-App-ID': '936619743392459',
            'X-Requested-With': 'XMLHttpRequest',
        }

        // Try the web profile info endpoint
        let profileData: any = null
        let recentCommenters: any[] = []

        try {
            const profileRes = await fetch(
                `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(cleanUsername)}`,
                { headers, next: { revalidate: 0 } }
            )

            if (profileRes.ok) {
                const json = await profileRes.json()
                profileData = json?.data?.user || null
            }
        } catch {
            // try alternate endpoint
        }

        // Fallback: try ?__a=1 endpoint
        if (!profileData) {
            try {
                const altRes = await fetch(
                    `https://www.instagram.com/${encodeURIComponent(cleanUsername)}/?__a=1&__d=dis`,
                    { headers, next: { revalidate: 0 } }
                )
                if (altRes.ok) {
                    const json = await altRes.json()
                    profileData = json?.graphql?.user || json?.user || null
                }
            } catch {
                // blocked
            }
        }

        if (!profileData) {
            return NextResponse.json({
                error: 'Instagram bloqueou a requisição. Tente novamente mais tarde ou use o modo autenticado com cookie de sessão.',
                blocked: true,
                leads: [],
            }, { status: 503 })
        }

        // Extract profile info as the primary "lead" (the competitor profile itself for analysis)
        const targetProfile = {
            instagramHandle: cleanUsername,
            fullName: profileData.full_name || profileData.name || '',
            biography: profileData.biography || profileData.bio || '',
            followersCount: profileData.edge_followed_by?.count || profileData.follower_count || 0,
            followingCount: profileData.edge_follow?.count || profileData.following_count || 0,
            postsCount: profileData.edge_owner_to_timeline_media?.count || profileData.media_count || 0,
            isVerified: profileData.is_verified || false,
            profilePicUrl: profileData.profile_pic_url || '',
            isPrivate: profileData.is_private || false,
            category: profileData.category || profileData.category_name || '',
            website: profileData.external_url || '',
        }

        // Extract recent commenters from posts (potential leads = people who engage with competitor content)
        const edges: any[] = profileData.edge_owner_to_timeline_media?.edges || []
        const commentersMap = new Map<string, any>()

        for (const edge of edges.slice(0, 6)) {
            const node = edge.node || {}
            const commentEdges: any[] = node.edge_media_to_comment?.edges || []
            for (const ce of commentEdges.slice(0, 10)) {
                const owner = ce.node?.owner || {}
                const handle = owner.username
                if (handle && handle !== cleanUsername && !commentersMap.has(handle)) {
                    commentersMap.set(handle, {
                        instagramHandle: handle,
                        fullName: owner.full_name || '',
                        biography: '',
                        followersCount: 0,
                        isVerified: owner.is_verified || false,
                        engagementType: 'COMMENTER',
                        sourceProfile: cleanUsername,
                    })
                }
                if (commentersMap.size >= maxLeads) break
            }
            if (commentersMap.size >= maxLeads) break
        }

        recentCommenters = Array.from(commentersMap.values())

        // Also extract likers if available
        const likerLeads: any[] = []
        for (const edge of edges.slice(0, 3)) {
            const node = edge.node || {}
            const likers: any[] = node.edge_liked_by?.edges || []
            for (const le of likers.slice(0, 5)) {
                const owner = le.node || {}
                const handle = owner.username
                if (handle && !commentersMap.has(handle) && handle !== cleanUsername) {
                    likerLeads.push({
                        instagramHandle: handle,
                        fullName: owner.full_name || '',
                        biography: '',
                        followersCount: 0,
                        isVerified: owner.is_verified || false,
                        engagementType: 'LIKER',
                        sourceProfile: cleanUsername,
                    })
                }
            }
        }

        const allLeads = [...recentCommenters, ...likerLeads].slice(0, maxLeads)

        return NextResponse.json({
            targetProfile,
            leads: allLeads,
            total: allLeads.length,
            note: allLeads.length === 0
                ? 'Perfil encontrado, mas sem engajadores visíveis. Para coletar seguidores, é necessário autenticação.'
                : `${allLeads.length} engajadores encontrados nos posts recentes de @${cleanUsername}`,
        })
    } catch (error) {
        console.error('instagram-scrape route error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor', leads: [] }, { status: 500 })
    }
}
