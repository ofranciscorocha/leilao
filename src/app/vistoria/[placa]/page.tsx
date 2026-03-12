import { notFound } from "next/navigation";
import Link from 'next/link';
import { PrintButton } from "@/components/vistoria/printbutton";

// This would come from DB in production
const vistorias: Record<string, any> = {
    'PYZ5J46': {
        placa: 'PYZ5J46',
        laudoNumero: 'LDO-2026-00147',
        dataVistoria: '02/03/2026',
        horaVistoria: '14:30',
        vistoriador: 'Francisco Rocha',
        veiculo: {
            marca: 'Chevrolet',
            modelo: 'Prisma 1.0 Joy',
            anoFab: '2017',
            anoMod: '2017',
            cor: 'Prata',
            combustivel: 'Flex + GNV',
            cambio: 'Manual (5 marchas)',
            portas: 4,
            motor: '1.0 SPE/4 Eco',
            potencia: '80 cv (E) / 78 cv (G)',
            chassi: '9BG************',
            renavam: '00***********',
            placa: 'PYZ5J46',
            km: '408.753',
            chave: 'Sim (1 unidade)',
            kitGas: 'Sim (Cilindro presente no porta-malas)',
            documentoGas: 'Sim',
        },
        fipe: {
            codigo: '004358-3',
            valorFipe: 45566.00,
            mesRef: 'Março/2026',
        },
        avaliacao: {
            valorAvaliado: 25000.00,
            observacoesPintura: 'Veículo 100% repintado, conforme evidenciado na vistoria.',
            depreciacaoKm: 'Alta quilometragem (408.753 km) — Fator de depreciação elevado.',
            estadoGeral: 'Regular',
            estadoMotor: 'Funcional — Liga e apresenta rotação estável. Luz de injeção acesa no painel (verificar).',
            estadoPneus: 'Em condições razoáveis, desgaste uniforme.',
            estadoInterior: 'Regular — Bancos em tecido, forração das portas íntegra.',
            estadoCarroceria: '100% repintada. Sem amassados aparentes. Leve oxidação visível.',
            alertas: [
                'Veículo 100% repintado — pode indicar reparos estruturais anteriores.',
                'Quilometragem muito elevada (408.753 km).',
                'Luz de injeção eletrônica acesa no painel.',
                'Kit GNV com cilindro aparentando oxidação — verificar validade do teste hidrostático.',
            ],
        },
        fotos: {
            frenteDireita: '/vistorias/PYZ5J46/img-7924-695e53ecd618b.jpeg',
            frenteEsquerda: '/vistorias/PYZ5J46/img-7924-695e53ee7e1bf.jpeg',
            traseiraEsquerda: '/vistorias/PYZ5J46/img-7924-695e53f1de463.jpeg',
            traseiraDireita: '/vistorias/PYZ5J46/img-7924-695e53f3850cf.jpeg',
            traseira: '/vistorias/PYZ5J46/img-7924-695e53f5211de.jpeg',
            motor: '/vistorias/PYZ5J46/img-7924-695e5404d88f4.jpeg',
            painel: '/vistorias/PYZ5J46/img-7924-695e5421beccd.jpeg',
            km: '/vistorias/PYZ5J46/img-7924-695e5422de117.jpeg',
            interior: '/vistorias/PYZ5J46/img-7924-695e542412923.jpeg',
            bancoTraseiro: '/vistorias/PYZ5J46/img-7924-695e541642d21.jpeg',
            gnv: '/vistorias/PYZ5J46/img-7924-695e541caed76.jpeg',
            rodaDD: '/vistorias/PYZ5J46/img-7924-695e53fd5dce1.jpeg',
            rodaDE: '/vistorias/PYZ5J46/img-7924-695e53feb27e3.jpeg',
            rodaTE: '/vistorias/PYZ5J46/img-7924-695e540016d55.jpeg',
            rodaTD: '/vistorias/PYZ5J46/img-7924-695e54016644b.jpeg',
            portaDD: '/vistorias/PYZ5J46/img-7924-695e540ecd516.jpeg',
            portaDE: '/vistorias/PYZ5J46/img-7924-695e541175406.jpeg',
            portaTD: '/vistorias/PYZ5J46/img-7924-695e54101bd4f.jpeg',
            portaTE: '/vistorias/PYZ5J46/img-7924-695e541303700.jpeg',
        },
        consultaBaseNacional: '/vistorias/PYZ5J46/consulta_base_nacional.pdf',
    }
};

export default async function VistoriaPage({ params }: { params: Promise<{ placa: string }> }) {
    const { placa } = await params;
    const data = vistorias[placa.toUpperCase()];
    if (!data) return notFound();

    const v = data.veiculo;
    const f = data.fipe;
    const a = data.avaliacao;
    const fotos = data.fotos;

    const formatCurrency = (val: number) =>
        val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="min-h-screen bg-white print:bg-white">
            {/* ======= PRINT STYLES ======= */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    html, body {
                        width: 210mm;
                        margin: 0;
                        padding: 0;
                        font-size: 11px;
                    }
                    .no-print { display: none !important; }
                    .page-break { page-break-before: always; }
                    .avoid-break { page-break-inside: avoid; break-inside: avoid; }
                    .laudo-container {
                        max-width: 100% !important;
                        padding: 0 10mm !important;
                        margin: 0 !important;
                    }
                    /* Preserve all backgrounds */
                    div, section, header, footer, span {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Ensure images print correctly */
                    img {
                        max-width: 100% !important;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    /* Photo grid sizing for print */
                    .print-photo-grid-3 { grid-template-columns: repeat(3, 1fr) !important; }
                    .print-photo-grid-4 { grid-template-columns: repeat(4, 1fr) !important; }
                    .print-photo-grid-3 img, .print-photo-grid-4 img { height: 120px !important; object-fit: cover !important; }
                    /* Section spacing for print */
                    .print-section { margin-bottom: 16px !important; }
                    /* Header section no rounded corners on print */
                    .print-header { border-radius: 0 !important; }
                    /* Grid columns for print */
                    .print-grid-2 { grid-template-columns: repeat(2, 1fr) !important; }
                    .print-grid-3 { grid-template-columns: repeat(3, 1fr) !important; }
                    /* Signature area */
                    .print-signature { margin-top: 30px !important; }
                    /* Footer */
                    .print-footer { position: relative; margin-top: 20px !important; }
                }
                @page {
                    margin: 8mm;
                    size: A4 portrait;
                }
            `}} />

            {/* ======= NO PRINT: Action Bar ======= */}
            <div className="no-print sticky top-0 z-50 bg-[#1a2332] text-white py-3 shadow-lg">
                <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/assets/logo-patio-rocha.png" alt="Pátio Rocha Leilões" className="h-10 w-auto" />
                    </Link>
                    <div className="flex gap-3">
                        <PrintButton />
                        <a
                            href={data.consultaBaseNacional}
                            target="_blank"
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded font-bold text-sm transition-colors"
                        >
                            📄 Consulta Base Nacional (PDF)
                        </a>
                    </div>
                </div>
            </div>

            <div className="laudo-container max-w-[1100px] mx-auto px-6 py-8">

                {/* ======= HEADER ======= */}
                <div className="bg-[#1a2332] rounded-xl overflow-hidden mb-8 print-header avoid-break">
                    <div className="flex items-center justify-between p-8">
                        <div className="flex items-center gap-5">
                            <img src="/assets/logo-patio-rocha.png" alt="Pátio Rocha Leilões" className="h-16 w-auto" />
                        </div>
                        <div className="text-right">
                            <div className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase">Laudo de Vistoria Cautelar</div>
                            <div className="text-white/60 text-sm mt-1">e Avaliação de Veículo</div>
                            <div className="text-white font-mono text-xs mt-2 bg-white/10 px-3 py-1 rounded inline-block">
                                Nº {data.laudoNumero}
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#D4AF37] h-1" />
                </div>

                {/* ======= INFO BAR ======= */}
                <div className="grid grid-cols-3 gap-4 mb-8 avoid-break print-grid-3 print-section">
                    <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-4 text-center">
                        <div className="text-xs text-[#6b7280] uppercase font-bold tracking-wider">Data da Vistoria</div>
                        <div className="text-lg font-bold text-[#1a2332] mt-1">{data.dataVistoria}</div>
                        <div className="text-xs text-[#9ca3af]">às {data.horaVistoria}</div>
                    </div>
                    <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-4 text-center">
                        <div className="text-xs text-[#6b7280] uppercase font-bold tracking-wider">Placa</div>
                        <div className="text-lg font-bold text-[#1a2332] mt-1 font-mono tracking-widest">{v.placa}</div>
                    </div>
                    <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-4 text-center">
                        <div className="text-xs text-[#6b7280] uppercase font-bold tracking-wider">Vistoriador</div>
                        <div className="text-lg font-bold text-[#1a2332] mt-1">{data.vistoriador}</div>
                    </div>
                </div>

                {/* ======= FOTO PRINCIPAL + DADOS ======= */}
                <div className="grid grid-cols-2 gap-6 mb-8 avoid-break print-grid-2 print-section">
                    <div className="rounded-xl overflow-hidden border border-[#e5e7eb] shadow-sm">
                        <img src={fotos.frenteDireita} alt="Vista frontal" className="w-full h-[320px] object-cover" />
                    </div>
                    <div className="bg-[#1a2332] text-white rounded-xl p-6">
                        <h2 className="text-[#D4AF37] font-bold text-sm uppercase tracking-wider mb-4">Identificação do Veículo</h2>
                        <div className="space-y-2.5 text-sm">
                            <InfoRow label="Marca / Modelo" value={`${v.marca} ${v.modelo}`} />
                            <InfoRow label="Ano Fab/Mod" value={`${v.anoFab}/${v.anoMod}`} />
                            <InfoRow label="Cor" value={v.cor} />
                            <InfoRow label="Combustível" value={v.combustivel} />
                            <InfoRow label="Câmbio" value={v.cambio} />
                            <InfoRow label="Portas" value={String(v.portas)} />
                            <InfoRow label="Motor" value={v.motor} />
                            <InfoRow label="Potência" value={v.potencia} />
                            <InfoRow label="Hodômetro" value={`${v.km} km`} />
                            <InfoRow label="Chave" value={v.chave} />
                            <InfoRow label="Kit GNV" value={v.kitGas} />
                            <InfoRow label="Doc. Gás" value={v.documentoGas} />
                        </div>
                    </div>
                </div>

                {/* ======= AVALIAÇÃO E FIPE ======= */}
                <div className="grid grid-cols-3 gap-6 mb-8 avoid-break print-grid-3 print-section">
                    <div className="bg-gradient-to-br from-[#D4AF37] to-[#b8962f] text-[#1a2332] rounded-xl p-6 flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-70">Valor FIPE</div>
                            <div className="text-3xl font-extrabold mt-2">{formatCurrency(f.valorFipe)}</div>
                            <div className="text-xs mt-1 opacity-60">Código FIPE: {f.codigo}</div>
                            <div className="text-xs opacity-60">Ref: {f.mesRef}</div>
                        </div>
                    </div>
                    <div className="bg-[#dc2626] text-white rounded-xl p-6 flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-80">Valor Avaliado</div>
                            <div className="text-3xl font-extrabold mt-2">{formatCurrency(a.valorAvaliado)}</div>
                            <div className="text-xs mt-1 opacity-70">
                                {Math.round((1 - a.valorAvaliado / f.valorFipe) * 100)}% abaixo da FIPE
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl p-6">
                        <div className="text-xs text-[#6b7280] font-bold uppercase tracking-wider">Estado Geral</div>
                        <div className="text-2xl font-extrabold text-[#1a2332] mt-2">{a.estadoGeral}</div>
                        <div className="mt-3 space-y-1">
                            <MiniBar label="Motor" status="Funcional" color="green" />
                            <MiniBar label="Pneus" status="Razoável" color="yellow" />
                            <MiniBar label="Interior" status="Regular" color="yellow" />
                            <MiniBar label="Carroceria" status="Repintada" color="orange" />
                        </div>
                    </div>
                </div>

                {/* ======= FATORES DE DEPRECIAÇÃO ======= */}
                <div className="mb-8 avoid-break print-section">
                    <SectionTitle title="Fatores de Depreciação e Observações" />
                    <div className="bg-[#fef3c7] border border-[#fbbf24]/30 rounded-xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <span className="text-xl">🔧</span>
                                <div>
                                    <div className="font-bold text-sm text-[#92400e]">Pintura 100% Refeita</div>
                                    <div className="text-xs text-[#a16207]">O veículo foi integralmente repintado, indicando possíveis reparos anteriores na carroceria.</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">📏</span>
                                <div>
                                    <div className="font-bold text-sm text-[#92400e]">Quilometragem Elevada</div>
                                    <div className="text-xs text-[#a16207]">{v.km} km registrados — desgaste natural de componentes mecânicos e estruturais esperado.</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">⚠️</span>
                                <div>
                                    <div className="font-bold text-sm text-[#92400e]">Luz de Injeção Eletrônica</div>
                                    <div className="text-xs text-[#a16207]">Indicador de falha no sistema de injeção aceso — recomenda-se diagnóstico eletrônico.</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">🔥</span>
                                <div>
                                    <div className="font-bold text-sm text-[#92400e]">Kit GNV — Cilindro com Oxidação</div>
                                    <div className="text-xs text-[#a16207]">Cilindro de gás apresenta oxidação superficial — verificar validade do teste hidrostático.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======= ALERTAS ======= */}
                <div className="mb-8 avoid-break print-section">
                    <SectionTitle title="Alertas da Vistoria" />
                    <div className="bg-[#fef2f2] border border-[#fca5a5]/30 rounded-xl p-5 space-y-2">
                        {a.alertas.map((alerta: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-[#dc2626] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">!</span>
                                <span className="text-sm text-[#991b1b]">{alerta}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ======= CONSULTA BASE NACIONAL ======= */}
                <div className="mb-8 avoid-break print-section">
                    <SectionTitle title="Consulta Base Nacional" />
                    <div className="bg-[#eff6ff] border border-[#93c5fd]/30 rounded-xl p-5">
                        <p className="text-sm text-[#1e40af] mb-3">
                            A consulta de dados do veículo na Base Nacional (RENAVAM/DETRAN) encontra-se disponível como documento PDF em anexo a este laudo.
                        </p>
                        <a
                            href={data.consultaBaseNacional}
                            target="_blank"
                            className="no-print inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                            📄 Abrir Consulta da Base Nacional (PDF)
                        </a>
                        <div className="hidden print:block text-xs text-[#1e40af] italic mt-2">
                            Documento anexo: Consulta Base Nacional — appcheckweb.com.br
                        </div>
                    </div>
                </div>

                {/* ======= PAGE BREAK FOR PRINT ======= */}
                <div className="page-break" />

                {/* ======= REGISTRO FOTOGRÁFICO ======= */}
                <div className="mb-8 print-section">
                    <SectionTitle title="Registro Fotográfico Completo" />

                    {/* Vistas Externas */}
                    <h3 className="text-sm font-bold text-[#4b5563] uppercase tracking-wider mb-3">Vistas Externas</h3>
                    <div className="grid grid-cols-3 gap-3 mb-6 print-photo-grid-3 avoid-break">
                        <FotoCard src={fotos.frenteDireita} label="Frente Lateral Direita" />
                        <FotoCard src={fotos.frenteEsquerda} label="Frente Lateral Esquerda" />
                        <FotoCard src={fotos.traseiraEsquerda} label="Traseira Lateral Esquerda" />
                        <FotoCard src={fotos.traseiraDireita} label="Traseira Lateral Direita" />
                        <FotoCard src={fotos.traseira} label="Traseira Central" />
                        <FotoCard src={fotos.motor} label="Compartimento do Motor" />
                    </div>

                    {/* Rodas e Pneus */}
                    <h3 className="text-sm font-bold text-[#4b5563] uppercase tracking-wider mb-3">Rodas e Pneus</h3>
                    <div className="grid grid-cols-4 gap-3 mb-6 print-photo-grid-4 avoid-break">
                        <FotoCard src={fotos.rodaDD} label="Roda Diant. Direita" />
                        <FotoCard src={fotos.rodaDE} label="Roda Diant. Esquerda" />
                        <FotoCard src={fotos.rodaTE} label="Roda Tras. Esquerda" />
                        <FotoCard src={fotos.rodaTD} label="Roda Tras. Direita" />
                    </div>

                    {/* Interior */}
                    <h3 className="text-sm font-bold text-[#4b5563] uppercase tracking-wider mb-3">Interior e Acabamento</h3>
                    <div className="grid grid-cols-3 gap-3 mb-6 print-photo-grid-3 avoid-break">
                        <FotoCard src={fotos.painel} label="Painel / Instrumentos" />
                        <FotoCard src={fotos.km} label="Hodômetro (408.753 km)" />
                        <FotoCard src={fotos.interior} label="Interior Frontal" />
                        <FotoCard src={fotos.bancoTraseiro} label="Banco Traseiro" />
                        <FotoCard src={fotos.gnv} label="Kit GNV (Cilindro)" />
                    </div>

                    {/* Portas */}
                    <h3 className="text-sm font-bold text-[#4b5563] uppercase tracking-wider mb-3">Portas e Forração</h3>
                    <div className="grid grid-cols-4 gap-3 mb-6 print-photo-grid-4 avoid-break">
                        <FotoCard src={fotos.portaDD} label="Porta Diant. Direita" />
                        <FotoCard src={fotos.portaDE} label="Porta Diant. Esquerda" />
                        <FotoCard src={fotos.portaTD} label="Porta Tras. Direita" />
                        <FotoCard src={fotos.portaTE} label="Porta Tras. Esquerda" />
                    </div>
                </div>

                {/* ======= RESUMO FINAL ======= */}
                <div className="mb-8 avoid-break print-section">
                    <SectionTitle title="Parecer Técnico e Conclusão" />
                    <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl p-6 text-sm text-[#374151] leading-relaxed">
                        <p className="mb-3">
                            O veículo <strong>{v.marca} {v.modelo}</strong>, placa <strong>{v.placa}</strong>, ano {v.anoFab}/{v.anoMod},
                            foi vistoriado em {data.dataVistoria} às {data.horaVistoria}h nas dependências do pátio.
                        </p>
                        <p className="mb-3">
                            Constatou-se que o veículo encontra-se em <strong>estado geral regular</strong>, apresentando quilometragem
                            elevada de <strong>{v.km} km</strong> e <strong>pintura 100% refeita</strong>, o que pode indicar reparos
                            estruturais ou estéticos anteriores. O veículo possui <strong>kit GNV</strong> instalado com cilindro
                            apresentando oxidação superficial.
                        </p>
                        <p className="mb-3">
                            Conforme Tabela FIPE (código {f.codigo}), o valor de referência é de <strong>{formatCurrency(f.valorFipe)}</strong>.
                            Considerando os fatores de depreciação identificados (alta quilometragem, pintura integral, estado do kit GNV
                            e alerta de injeção eletrônica), <strong>o veículo foi avaliado em {formatCurrency(a.valorAvaliado)}</strong>,
                            representando aproximadamente <strong>{Math.round((1 - a.valorAvaliado / f.valorFipe) * 100)}% abaixo</strong> do valor FIPE.
                        </p>
                        <p>
                            A consulta veicular na Base Nacional consta em documento em anexo a este laudo.
                        </p>
                    </div>
                </div>

                {/* ======= ASSINATURA ======= */}
                <div className="grid grid-cols-2 gap-12 mt-12 mb-8 avoid-break print-signature print-grid-2">
                    <div className="text-center">
                        <div className="border-t-2 border-[#1a2332] pt-3 mx-8">
                            <div className="font-bold text-sm text-[#1a2332]">{data.vistoriador}</div>
                            <div className="text-xs text-[#6b7280]">Vistoriador Responsável</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="border-t-2 border-[#1a2332] pt-3 mx-8">
                            <div className="font-bold text-sm text-[#1a2332]">Pátio Rocha Leilões</div>
                            <div className="text-xs text-[#6b7280]">Carimbo / Assinatura</div>
                        </div>
                    </div>
                </div>

                {/* ======= FOOTER ======= */}
                <div className="border-t border-[#e5e7eb] pt-4 mt-8 print-footer">
                    <div className="flex items-center justify-between text-xs text-[#9ca3af]">
                        <span>© 2026 Pátio Rocha Leilões — Documento gerado automaticamente</span>
                        <span>Laudo {data.laudoNumero} • {data.dataVistoria} • Placa {v.placa}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
            <span className="text-white/50 text-xs">{label}</span>
            <span className="text-white font-semibold text-xs">{value}</span>
        </div>
    );
}

function SectionTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-[#D4AF37] rounded-full" />
            <h2 className="text-lg font-bold text-[#1a2332]">{title}</h2>
        </div>
    );
}

function FotoCard({ src, label }: { src: string; label: string }) {
    return (
        <div className="rounded-lg overflow-hidden border border-[#e5e7eb] shadow-sm">
            <img src={src} alt={label} className="w-full h-40 object-cover" />
            <div className="bg-[#f8f9fa] px-2 py-1.5 text-center">
                <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider">{label}</span>
            </div>
        </div>
    );
}

function MiniBar({ label, status, color }: { label: string; status: string; color: string }) {
    const colors: Record<string, string> = {
        green: 'bg-[#10b981] text-white',
        yellow: 'bg-[#f59e0b] text-white',
        orange: 'bg-[#f97316] text-white',
        red: 'bg-[#dc2626] text-white',
    };
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-[#6b7280]">{label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${colors[color]}`}>{status}</span>
        </div>
    );
}
