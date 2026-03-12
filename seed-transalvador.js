// Seed: Leilão de Sucatas Aproveitáveis - TRANSALVADOR
// Dados extraídos do PDF "Relatório de Lotes"

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para mascarar nomes: primeira e última letra + asteriscos
function maskName(name) {
    if (!name || name.length <= 2) return name;
    const words = name.trim().split(/\s+/);
    return words.map(word => {
        if (word.length <= 2) return word;
        const first = word[0];
        const last = word[word.length - 1];
        const stars = '*'.repeat(word.length - 2);
        return first + stars + last;
    }).join(' ');
}

// Arrematantes mascarados
const arrematantes = {
    'REIS MOTO PECAS EIRELI': maskName('REIS MOTO PECAS EIRELI'),
    'DESMANCHE E COMERCIO DE PECAS': maskName('DESMANCHE E COMERCIO DE PECAS'),
    'OLIVEIRA FERREIRA SILVA': maskName('OLIVEIRA FERREIRA SILVA'),
    'VANESSA DOMINGOS DA SILVA 00994158106 ME': maskName('VANESSA DOMINGOS DA SILVA'),
    'BM MOTOS PECAS USADAS LTDA': maskName('BM MOTOS PECAS USADAS LTDA'),
    'NWC COMERCIO DE PARTES E PEÇAS EIRELI': maskName('NWC COMERCIO DE PARTES E PEÇAS EIRELI'),
    'V&B PEÇAS': maskName('V&B PEÇAS'),
    'F S DESMONTE LTDA': maskName('F S DESMONTE LTDA'),
};

console.log('=== Arrematantes mascarados ===');
Object.entries(arrematantes).forEach(([k, v]) => console.log(`  ${k} => ${v}`));

const lots = [
    { lotNumber: 1, title: 'FORD/KA FLEX - SUCATA', description: 'Marca/Modelo: FORD/KA FLEX, Placa: SUP____, Ano/Modelo: 2009/2009, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2009/2009', color: 'PRETA', category: 'VEICULO', startingPrice: 1470, currentBid: 2120, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 3, title: 'FIAT/DOBLO ELX FLEX - SUCATA', description: 'Marca/Modelo: FIAT/DOBLO ELX FLEX, Placa: SUP____, Ano/Modelo: 2006/2006, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2006/2006', color: 'PRATA', category: 'VEICULO', startingPrice: 1930, currentBid: 4530, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 4, title: 'CHEVROLET/MONTANA LS - SUCATA', description: 'Marca/Modelo: CHEVROLET/MONTANA LS, Placa: SUP____, Ano/Modelo: 2013/2013, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2013/2013', color: 'BRANCA', category: 'VEICULO', startingPrice: 2985, currentBid: 7135, status: 'SOLD', buyer: arrematantes['DESMANCHE E COMERCIO DE PECAS'] },
    { lotNumber: 7, title: 'I/FORD FOCUS 1.6L FC - SUCATA', description: 'Marca/Modelo: I/FORD FOCUS 1.6L FC, Placa: SUP____, Ano/Modelo: 2007/2007, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2007/2007', color: 'PRATA', category: 'VEICULO', startingPrice: 1505, currentBid: 1505, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 8, title: 'I/FORD FOCUS 1.8L HA - SUCATA', description: 'Marca/Modelo: I/FORD FOCUS 1.8L HA, Placa: SUP____, Ano/Modelo: 2002/2003, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2002/2003', color: 'PRATA', category: 'VEICULO', startingPrice: 980, currentBid: 980, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 10, title: 'FIAT/SIENA FIRE - SUCATA', description: 'Marca/Modelo: FIAT/SIENA FIRE, Placa: SUP____, Ano/Modelo: 2005/2006, Chassi: SUPRIMIDO, Cor: CINZA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2005/2006', color: 'CINZA', category: 'VEICULO', startingPrice: 1450, currentBid: 1500, status: 'SOLD', buyer: arrematantes['DESMANCHE E COMERCIO DE PECAS'] },
    { lotNumber: 11, title: 'I/CITROEN C4 PALLAS20GAF - SUCATA', description: 'Marca/Modelo: I/CITROEN C4 PALLAS20GAF, Placa: SUP____, Ano/Modelo: 2009/2010, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2009/2010', color: 'PRETA', category: 'VEICULO', startingPrice: 1775, currentBid: 1775, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 12, title: 'GM/S10 - SUCATA', description: 'Marca/Modelo: GM/S10, Placa: SUP____, Ano/Modelo: 1995/1996, Chassi: SUPRIMIDO, Cor: CINZA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '1995/1996', color: 'CINZA', category: 'VEICULO', startingPrice: 1895, currentBid: 1945, status: 'SOLD', buyer: arrematantes['VANESSA DOMINGOS DA SILVA 00994158106 ME'] },
    { lotNumber: 14, title: 'CHEVROLET/PRISMA 1.4L LT - SUCATA', description: 'Marca/Modelo: CHEVROLET/PRISMA 1.4L LT, Placa: SUP____, Ano/Modelo: 2012/2012, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2012/2012', color: 'PRETA', category: 'VEICULO', startingPrice: 2185, currentBid: 2285, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 18, title: 'GM/CELTA 4P SPIRIT - SUCATA', description: 'Marca/Modelo: GM/CELTA 4P SPIRIT, Placa: SUP____, Ano/Modelo: 2010/2011, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2010/2011', color: 'PRETA', category: 'VEICULO', startingPrice: 1980, currentBid: 1980, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 20, title: 'FORD/KA GL - SUCATA', description: 'Marca/Modelo: FORD/KA GL, Placa: SUP____, Ano/Modelo: 2007/2007, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2007/2007', color: 'PRATA', category: 'VEICULO', startingPrice: 1115, currentBid: 1365, status: 'SOLD', buyer: arrematantes['VANESSA DOMINGOS DA SILVA 00994158106 ME'] },
    { lotNumber: 21, title: 'FORD/FIESTA - SUCATA', description: 'Marca/Modelo: FORD/FIESTA, Placa: SUPRIMIDO, Ano/Modelo: 1997/1998, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '1997/1998', color: 'VERMELHA', category: 'VEICULO', startingPrice: 1115, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 22, title: 'PEUGEOT/208 ACTIVE - SUCATA', description: 'Marca/Modelo: PEUGEOT/208 ACTIVE, Placa: SUP____, Ano/Modelo: 2014/2014, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2014/2014', color: 'BRANCA', category: 'VEICULO', startingPrice: 2755, currentBid: 2755, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 23, title: 'CHEVROLET/ONIX 10MT JOYE - SUCATA', description: 'Marca/Modelo: CHEVROLET/ONIX 10MT JOYE, Placa: SUP____, Ano/Modelo: 2019/2019, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2019/2019', color: 'BRANCA', category: 'VEICULO', startingPrice: 3775, currentBid: 3775, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 27, title: 'GM/MERIVA MAXX - SUCATA', description: 'Marca/Modelo: GM/MERIVA MAXX, Placa: SUP____, Ano/Modelo: 2012/2012, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2012/2012', color: 'BRANCA', category: 'VEICULO', startingPrice: 2230, currentBid: 2230, status: 'SOLD', buyer: arrematantes['BM MOTOS PECAS USADAS LTDA'] },
    { lotNumber: 28, title: 'VW/GOL 1.0 - SUCATA', description: 'Marca/Modelo: VW/GOL 1.0, Placa: SUP____, Ano/Modelo: 2007/2008, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2007/2008', color: 'PRETA', category: 'VEICULO', startingPrice: 1500, currentBid: 1500, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 34, title: 'VW/GOL 1.0 GIV - SUCATA', description: 'Marca/Modelo: VW/GOL 1.0 GIV, Placa: SUP____, Ano/Modelo: 2010/2011, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2010/2011', color: 'VERMELHA', category: 'VEICULO', startingPrice: 1885, currentBid: 3385, status: 'SOLD', buyer: arrematantes['NWC COMERCIO DE PARTES E PEÇAS EIRELI'] },
    { lotNumber: 35, title: 'I/JAC J3 - SUCATA', description: 'Marca/Modelo: I/JAC J3, Placa: SUP____, Ano/Modelo: 2012/2013, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2012/2013', color: 'BRANCA', category: 'VEICULO', startingPrice: 1540, currentBid: 1540, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 36, title: 'FORD/FIESTA - SUCATA', description: 'Marca/Modelo: FORD/FIESTA, Placa: SUP____, Ano/Modelo: 2003/2003, Chassi: SUPRIMIDO, Cor: AZUL, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2003/2003', color: 'AZUL', category: 'VEICULO', startingPrice: 1045, currentBid: 1045, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 39, title: 'FIAT/PALIO FIRE FLEX - SUCATA', description: 'Marca/Modelo: FIAT/PALIO FIRE FLEX, Placa: SUP____, Ano/Modelo: 2008/2008, Chassi: SUPRIMIDO, Cor: VERDE, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2008/2008', color: 'VERDE', category: 'VEICULO', startingPrice: 1925, currentBid: 2475, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 40, title: 'GM/CELTA 3 PORTAS - SUCATA', description: 'Marca/Modelo: GM/CELTA 3 PORTAS, Placa: SUP____, Ano/Modelo: 2002/2003, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2002/2003', color: 'BRANCA', category: 'VEICULO', startingPrice: 995, currentBid: 995, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 41, title: 'IMP/DAEWOO S SALON ACE - SUCATA', description: 'Marca/Modelo: IMP/DAEWOO S SALON ACE, Placa: SUP____, Ano/Modelo: 1995/1995, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '1995/1995', color: 'PRATA', category: 'VEICULO', startingPrice: 1175, currentBid: 1175, status: 'SOLD', buyer: arrematantes['BM MOTOS PECAS USADAS LTDA'] },
    { lotNumber: 42, title: 'GM/VECTRA GLS - SUCATA', description: 'Marca/Modelo: GM/VECTRA GLS, Placa: SUPRIMIDO, Ano/Modelo: 1995/1995, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '1995/1995', color: 'VERMELHA', category: 'VEICULO', startingPrice: 1175, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 44, title: 'I/FORD FOCUS GHIA 2.0LFC - SUCATA', description: 'Marca/Modelo: I/FORD FOCUS GHIA 2.0LFC, Placa: SUP____, Ano/Modelo: 2002/2002, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2002/2002', color: 'PRATA', category: 'VEICULO', startingPrice: 645, currentBid: 645, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 45, title: 'RENAULT/LOGAN EXP 1016V - SUCATA', description: 'Marca/Modelo: RENAULT/LOGAN EXP 1016V, Placa: SUP____, Ano/Modelo: 2011/2012, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2011/2012', color: 'BRANCA', category: 'VEICULO', startingPrice: 1625, currentBid: 1625, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 49, title: 'PEUGEOT/206 14 PRESENC - SUCATA', description: 'Marca/Modelo: PEUGEOT/206 14 PRESENC, Placa: SUP____, Ano/Modelo: 2005/2005, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2005/2005', color: 'PRATA', category: 'VEICULO', startingPrice: 635, currentBid: 635, status: 'SOLD', buyer: arrematantes['BM MOTOS PECAS USADAS LTDA'] },
    { lotNumber: 52, title: 'I/CHANGHE M100 CH7101 - SUCATA', description: 'Marca/Modelo: I/CHANGHE M100 CH7101, Placa: SUP____, Ano/Modelo: 2010/2010, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2010/2010', color: 'VERMELHA', category: 'VEICULO', startingPrice: 1185, currentBid: 1185, status: 'SOLD', buyer: arrematantes['V&B PEÇAS'] },
    { lotNumber: 56, title: 'I/RENAULT TWINGO 1.0 16V - SUCATA', description: 'Marca/Modelo: I/RENAULT TWINGO 1.0 16V, Placa: SUPRIMIDO, Ano/Modelo: 2001/2002, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2001/2002', color: 'PRETA', category: 'VEICULO', startingPrice: 1455, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 59, title: 'GM/CELTA - SUCATA', description: 'Marca/Modelo: GM/CELTA, Placa: SUP____, Ano/Modelo: 2002/2002, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2002/2002', color: 'PRETA', category: 'VEICULO', startingPrice: 950, currentBid: 950, status: 'SOLD', buyer: arrematantes['BM MOTOS PECAS USADAS LTDA'] },
    { lotNumber: 60, title: 'VW/CROSSFOX - SUCATA', description: 'Marca/Modelo: VW/CROSSFOX, Placa: SUP____, Ano/Modelo: 2008/2009, Chassi: SUPRIMIDO, Cor: AMARELA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2008/2009', color: 'AMARELA', category: 'VEICULO', startingPrice: 2400, currentBid: 2400, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 68, title: 'I/GM CORSA CLASSIC - SUCATA', description: 'Marca/Modelo: I/GM CORSA CLASSIC, Placa: SUP____, Ano/Modelo: 2002/2003, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2002/2003', color: 'PRATA', category: 'VEICULO', startingPrice: 1345, currentBid: 1645, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 76, title: 'FORD/FIESTA - SUCATA', description: 'Marca/Modelo: FORD/FIESTA, Placa: SUP____, Ano/Modelo: 2004/2005, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2004/2005', color: 'PRETA', category: 'VEICULO', startingPrice: 1135, currentBid: 1135, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 77, title: 'GM/CELTA 4P SPIRIT - SUCATA', description: 'Marca/Modelo: GM/CELTA 4P SPIRIT, Placa: SUPRIMIDO, Ano/Modelo: 2005/2006, Chassi: SUPRIMIDO, Cor: AZUL, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2005/2006', color: 'AZUL', category: 'VEICULO', startingPrice: 1410, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 78, title: 'FORD/FIESTA - SUCATA', description: 'Marca/Modelo: FORD/FIESTA, Placa: SUP____, Ano/Modelo: 2004/2004, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2004/2004', color: 'PRATA', category: 'VEICULO', startingPrice: 955, currentBid: 955, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 79, title: 'VW/SAVEIRO CL 1.6 MI - SUCATA', description: 'Marca/Modelo: VW/SAVEIRO CL 1.6 MI, Placa: SUP____, Ano/Modelo: 1998/1999, Chassi: SUPRIMIDO, Cor: AZUL, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '1998/1999', color: 'AZUL', category: 'VEICULO', startingPrice: 1445, currentBid: 1445, status: 'SOLD', buyer: arrematantes['NWC COMERCIO DE PARTES E PEÇAS EIRELI'] },
    { lotNumber: 80, title: 'FIAT/PALIO ELX DUALOGIC - SUCATA', description: 'Marca/Modelo: FIAT/PALIO ELX DUALOGIC, Placa: SUP____, Ano/Modelo: 2010/2010, Chassi: SUPRIMIDO, Cor: AZUL, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2010/2010', color: 'AZUL', category: 'VEICULO', startingPrice: 2330, currentBid: 2480, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 81, title: 'VW/GOL CLI - SUCATA', description: 'Marca/Modelo: VW/GOL CLI, Placa: SUPRIMIDO, Ano/Modelo: 1996/1996, Chassi: SUPRIMIDO, Cor: VERDE, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '1996/1996', color: 'VERDE', category: 'VEICULO', startingPrice: 1135, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 82, title: 'GM/CELTA 2P LIFE - SUCATA', description: 'Marca/Modelo: GM/CELTA 2P LIFE, Placa: SUP____, Ano/Modelo: 2005/2006, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2005/2006', color: 'BRANCA', category: 'VEICULO', startingPrice: 1055, currentBid: 1055, status: 'SOLD', buyer: arrematantes['BM MOTOS PECAS USADAS LTDA'] },
    { lotNumber: 84, title: 'VW/GOL FUN - SUCATA', description: 'Marca/Modelo: VW/GOL FUN, Placa: SUPRIMIDO, Ano/Modelo: 2001/2001, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2001/2001', color: 'PRATA', category: 'VEICULO', startingPrice: 835, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 85, title: 'I/CHERY CIELO 1.6 SEDAN - SUCATA', description: 'Marca/Modelo: I/CHERY CIELO 1.6 SEDAN, Placa: SUP____, Ano/Modelo: 2010/2010, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2010/2010', color: 'PRETA', category: 'VEICULO', startingPrice: 1200, currentBid: 1200, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 86, title: 'VW/GOL 1.0 - SUCATA', description: 'Marca/Modelo: VW/GOL 1.0, Placa: SUP____, Ano/Modelo: 2009/2010, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2009/2010', color: 'VERMELHA', category: 'VEICULO', startingPrice: 1820, currentBid: 2270, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 87, title: 'I/KIA SPORTAGE LX2 OFFG4 - SUCATA', description: 'Marca/Modelo: I/KIA SPORTAGE LX2 OFFG4, Placa: SUP____, Ano/Modelo: 2012/2013, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2012/2013', color: 'BRANCA', category: 'VEICULO', startingPrice: 5010, currentBid: 0, status: 'SUSPENDED', buyer: null },
    { lotNumber: 88, title: 'RENAULT/LOGAN EXP 1016V - SUCATA', description: 'Marca/Modelo: RENAULT/LOGAN EXP 1016V, Placa: SUP____, Ano/Modelo: 2013/2013, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2013/2013', color: 'VERMELHA', category: 'VEICULO', startingPrice: 1935, currentBid: 1935, status: 'SOLD', buyer: arrematantes['OLIVEIRA FERREIRA SILVA'] },
    { lotNumber: 103, title: 'FIAT/UNO MILLE ECONOMY - SUCATA', description: 'Marca/Modelo: FIAT/UNO MILLE ECONOMY, Placa: SUP____, Ano/Modelo: 2012/2013, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2012/2013', color: 'BRANCA', category: 'VEICULO', startingPrice: 2110, currentBid: 2360, status: 'SOLD', buyer: arrematantes['BM MOTOS PECAS USADAS LTDA'] },
    { lotNumber: 104, title: 'IMP/MBENZ 310D SPRINTERM - SUCATA', description: 'Marca/Modelo: IMP/MBENZ 310D SPRINTERM, Placa: SUP____, Ano/Modelo: 1998/1998, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '1998/1998', color: 'BRANCA', category: 'VEICULO', startingPrice: 2680, currentBid: 2980, status: 'SOLD', buyer: arrematantes['BM MOTOS PECAS USADAS LTDA'] },
    { lotNumber: 105, title: 'FIAT/PALIO YOUNG - SUCATA', description: 'Marca/Modelo: FIAT/PALIO YOUNG, Placa: SUPRIMIDO, Ano/Modelo: 2002/2002, Chassi: SUPRIMIDO, Cor: AZUL, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2002/2002', color: 'AZUL', category: 'VEICULO', startingPrice: 870, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 106, title: 'FORD/FIESTA - SUCATA', description: 'Marca/Modelo: FORD/FIESTA, Placa: SUP____, Ano/Modelo: 2005/2005, Chassi: SUPRIMIDO, Cor: PRATA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2005/2005', color: 'PRATA', category: 'VEICULO', startingPrice: 1195, currentBid: 1195, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 110, title: 'GM/CORSA WIND - SUCATA', description: 'Marca/Modelo: GM/CORSA WIND, Placa: SUP____, Ano/Modelo: 2000/2001, Chassi: SUPRIMIDO, Cor: CINZA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2000/2001', color: 'CINZA', category: 'VEICULO', startingPrice: 1035, currentBid: 1035, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    { lotNumber: 111, title: 'GM/CORSA CLASSIC - SUCATA', description: 'Marca/Modelo: GM/CORSA CLASSIC, Placa: SUP____, Ano/Modelo: 2003/2004, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2003/2004', color: 'BRANCA', category: 'VEICULO', startingPrice: 1375, currentBid: 1375, status: 'SOLD', buyer: arrematantes['REIS MOTO PECAS EIRELI'] },
    // MOTOS
    { lotNumber: 119, title: 'DAFRA/SPEED 150 - SUCATA', description: 'Marca/Modelo: DAFRA/SPEED 150, Placa: SUPRIMIDO, Ano/Modelo: 2009/2010, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2009/2010', color: 'PRETA', category: 'MOTO', startingPrice: 310, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 124, title: 'YAMAHA/YBR 125ED - SUCATA', description: 'Marca/Modelo: YAMAHA/YBR 125ED, Placa: SUP____, Ano/Modelo: 2005/2006, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2005/2006', color: 'VERMELHA', category: 'MOTO', startingPrice: 460, currentBid: 760, status: 'SOLD', buyer: arrematantes['F S DESMONTE LTDA'] },
    { lotNumber: 129, title: 'HONDA/POP100 - SUCATA', description: 'Marca/Modelo: HONDA/POP100, Placa: SUP____, Ano/Modelo: 2011/2012, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2011/2012', color: 'VERMELHA', category: 'MOTO', startingPrice: 505, currentBid: 1855, status: 'SOLD', buyer: arrematantes['DESMANCHE E COMERCIO DE PECAS'] },
    { lotNumber: 133, title: 'HONDA/NXR150 BROS KS - SUCATA', description: 'Marca/Modelo: HONDA/NXR150 BROS KS, Placa: SUP____, Ano/Modelo: 2011/2011, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2011/2011', color: 'PRETA', category: 'MOTO', startingPrice: 805, currentBid: 2455, status: 'SOLD', buyer: arrematantes['F S DESMONTE LTDA'] },
    { lotNumber: 135, title: 'HONDA/CBX 200 STRADA - SUCATA', description: 'Marca/Modelo: HONDA/CBX 200 STRADA, Placa: SUPRIMIDO, Ano/Modelo: 2000/2000, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2000/2000', color: 'VERMELHA', category: 'MOTO', startingPrice: 510, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 156, title: 'DAFRA/TVS APACHE RTR 150 - SUCATA', description: 'Marca/Modelo: DAFRA/TVS APACHE RTR 150, Placa: SUP____, Ano/Modelo: 2010/2011, Chassi: SUPRIMIDO, Cor: PRETA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2010/2011', color: 'PRETA', category: 'MOTO', startingPrice: 355, currentBid: 555, status: 'SOLD', buyer: arrematantes['DESMANCHE E COMERCIO DE PECAS'] },
    { lotNumber: 162, title: 'HONDA/CG 125 FAN KS - SUCATA', description: 'Marca/Modelo: HONDA/CG 125 FAN KS, Placa: SUP____, Ano/Modelo: 2013/2014, Chassi: SUPRIMIDO, Cor: VERMELHA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2013/2014', color: 'VERMELHA', category: 'MOTO', startingPrice: 675, currentBid: 1725, status: 'SOLD', buyer: arrematantes['DESMANCHE E COMERCIO DE PECAS'] },
    { lotNumber: 163, title: 'JTA/SUZUKI EN125 YES SE - SUCATA', description: 'Marca/Modelo: JTA/SUZUKI EN125 YES SE, Placa: SUP____, Ano/Modelo: 2013/2013, Chassi: SUPRIMIDO, Cor: AMARELA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2013/2013', color: 'AMARELA', category: 'MOTO', startingPrice: 675, currentBid: 675, status: 'SOLD', buyer: arrematantes['F S DESMONTE LTDA'] },
    { lotNumber: 166, title: 'DAFRA/RIVA 150 - SUCATA', description: 'Marca/Modelo: DAFRA/RIVA 150, Placa: SUPRIMIDO, Ano/Modelo: 2014/2015, Chassi: SUPRIMIDO, Cor: BRANCA, Cidade: Salvador/BA, SUCATA APROVEITÁVEL COM MOTOR INSERVÍVEL', year: '2014/2015', color: 'BRANCA', category: 'MOTO', startingPrice: 445, currentBid: 0, status: 'UNSOLD', buyer: null },
    { lotNumber: 171, title: 'JTA/SUZUKI INTRUDER 125 - SUCATA', description: 'Marca/Modelo: JTA/SUZUKI INTRUDER 125, Placa: SUPRIMIDO, Ano/Modelo: 2008/2008, Chassi: SUPRIMIDO, Cor: VERDE, Cidade: Salvador/BA, SUCATA APROVEITÁVEL', year: '2008/2008', color: 'VERDE', category: 'MOTO', startingPrice: 525, currentBid: 0, status: 'UNSOLD', buyer: null },
];

async function main() {
    console.log(`\n📦 Criando Leilão de Sucatas Aproveitáveis - TRANSALVADOR...`);
    console.log(`Total de lotes: ${lots.length}\n`);

    // Create the auction
    const auction = await prisma.auction.create({
        data: {
            title: 'Leilão de Sucatas Aproveitáveis',
            description: 'Leilão de Sucatas Aproveitáveis - Superintendência de Trânsito de Salvador (TRANSALVADOR)',
            summary: 'Sucatas aproveitáveis de veículos e motocicletas apreendidos pela TRANSALVADOR',
            status: 'FINISHED',
            type: 'ONLINE',
            modalidade: 'ABERTO',
            startDate: new Date('2025-12-15T14:01:00'),
            endDate: new Date('2025-12-15T18:00:00'),
            biddingStart: new Date('2025-12-15T14:01:00'),
        },
    });

    console.log(`✅ Leilão criado: ${auction.id} - ${auction.title}`);

    // Create lots
    for (const lot of lots) {
        const statusMap = {
            'SOLD': 'SOLD',
            'UNSOLD': 'CLOSED',
            'SUSPENDED': 'CLOSED',
        };

        await prisma.lot.create({
            data: {
                lotNumber: lot.lotNumber,
                title: lot.title,
                description: `${lot.description}\n\nArrematante: ${lot.buyer || 'Sem Licitante'}`,
                category: lot.category,
                year: lot.year,
                color: lot.color,
                plate: 'SUPRIMIDO',
                chassis: 'SUPRIMIDO',
                location: 'Salvador/BA',
                startingPrice: lot.startingPrice,
                currentBid: lot.currentBid || null,
                status: statusMap[lot.status] || 'CLOSED',
                condition: 'SUCATA',
                auctionId: auction.id,
            },
        });
    }

    console.log(`✅ ${lots.length} lotes criados com sucesso!`);
    console.log(`\n🔗 Acesse: http://localhost:3002`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
