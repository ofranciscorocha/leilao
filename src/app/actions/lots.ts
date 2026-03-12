'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createLot(formData: FormData) {
    const lotNumberStr = formData.get('lotNumber') as string;
    const lotNumber = parseInt(lotNumberStr) || 0;

    // Check if lotNumber already exists
    if (lotNumber > 0) {
        const existing = await prisma.lot.findFirst({ where: { lotNumber } });
        if (existing) {
            throw new Error(`Número de lote ${lotNumber} já está em uso.`);
        }
    }

    const auctionId = formData.get('auctionId') as string;

    if (!auctionId) {
        throw new Error("ID do leilão é obrigatório para cadastrar um lote.");
    }

    const lot = await (prisma.lot as any).create({
        data: {
            lotNumber,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            manufacturer: formData.get('manufacturer') as string,
            model: formData.get('model') as string,
            year: formData.get('year') as string,
            color: formData.get('color') as string,
            fuel: formData.get('fuel') as string,
            startingPrice: parseFloat(formData.get('startingPrice') as string) || 0,
            incrementAmount: parseFloat(formData.get('incrementAmount') as string) || 50,
            reservePrice: parseFloat(formData.get('reservePrice') as string) || null,
            location: formData.get('location') as string,

            // Robust Fields
            placaUf: formData.get('placaUf') as string,
            chassis: formData.get('chassis') as string,
            renavam: formData.get('renavam') as string,
            numeroMotor: formData.get('numeroMotor') as string,
            linhaVeiculo: formData.get('linhaVeiculo') as string,
            versaoVeiculo: formData.get('versaoVeiculo') as string,
            fipeCodigo: formData.get('fipeCodigo') as string,
            fipeValor: parseFloat(formData.get('fipeValor') as string) || null,
            sucata: formData.get('sucata') === 'on',
            hasKeys: formData.get('hasKeys') === 'on',
            accessories: formData.get('accessories') as string,
            processoSei: formData.get('processoSei') as string,
            orgaoContrato: formData.get('orgaoContrato') as string,
            observacoes: formData.get('observacoes') as string,
            observacoesInternas: formData.get('observacoesInternas') as string,
            comitente: formData.get('comitente') as string,
            entrada: new Date(),
            status: (formData.get('status') as string) || 'AVAILABLE',
            auctionId: auctionId,
        }
    });

    redirect(`/admin/lots/${lot.id}`);
}
