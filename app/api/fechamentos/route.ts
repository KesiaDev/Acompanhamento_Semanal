import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
        const { executivo, agencia, regional, qtdVisitas, qtdInteracoes, qtdBraExpre, data, credenciamentos, cnpjsSimulados } = body

    // Validação básica
    if (!executivo || !agencia || qtdVisitas === undefined || qtdInteracoes === undefined || qtdBraExpre === undefined) {
      return NextResponse.json(
        { error: 'Todos os campos principais são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar fechamento com credenciamentos
    const dataFechamento = data ? new Date(data + 'T12:00:00') : new Date(new Date().toISOString().split('T')[0] + 'T12:00:00')
    
    console.log('Criando fechamento com data:', dataFechamento)
    console.log('Data original:', data)
    console.log('Executivo:', executivo)
    console.log('Credenciamentos recebidos:', credenciamentos)

    // Filtrar credenciamentos válidos (que têm pelo menos EC e volumeRS preenchidos)
    const credenciamentosValidos = (credenciamentos || []).filter((cred: any) => 
      cred && cred.ec && cred.volumeRS && cred.ec.toString().trim() !== '' && cred.volumeRS.toString().trim() !== ''
    )

    console.log('Credenciamentos válidos:', credenciamentosValidos.length)

    // Filtrar CNPJs simulados válidos
    const cnpjsValidos = (cnpjsSimulados || []).filter((cnpj: any) =>
      cnpj && cnpj.cnpj && cnpj.nomeEmpresa && cnpj.faturamento &&
      cnpj.cnpj.toString().trim() !== '' && cnpj.nomeEmpresa.toString().trim() !== ''
    )

    console.log('Dados antes de criar:', {
      executivo,
      agencia,
      qtdVisitas: parseInt(qtdVisitas),
      qtdInteracoes: parseInt(qtdInteracoes),
      qtdBraExpre: parseInt(qtdBraExpre),
      dataFechamento,
      credenciamentosCount: credenciamentosValidos.length,
      cnpjsCount: cnpjsValidos.length
    })

    try {
      const fechamento = await prisma.fechamento.create({
        data: {
          executivo,
          agencia,
          regional: regional || 'KESIA WEIGE NANDI',
          qtdVisitas: parseInt(qtdVisitas),
          qtdInteracoes: parseInt(qtdInteracoes),
          qtdBraExpre: parseInt(qtdBraExpre),
          data: dataFechamento,
          credenciamentos: {
            create: credenciamentosValidos.map((cred: any) => ({
              qtdCredenciamentos: 1, // Cada credenciamento adicionado = 1 credenciamento
              ativacoesValor: 0, // Campo removido, sempre 0
              ec: cred.ec,
              volumeRS: parseFloat(cred.volumeRS),
              ra: cred.ra === 'true' || cred.ra === true || cred.ra === 'True' || cred.ra === 'TRUE',
              cesta: cred.cesta,
              instalaDireto: cred.instalaDireto === 'true' || cred.instalaDireto === true || cred.instalaDireto === 'True' || cred.instalaDireto === 'TRUE',
              nomeGerentePJ: cred.nomeGerentePJ || null,
            }))
          },
          cnpjsSimulados: {
            create: cnpjsValidos.map((cnpj: any) => ({
              cnpj: cnpj.cnpj,
              nomeEmpresa: cnpj.nomeEmpresa,
              faturamento: parseFloat(cnpj.faturamento),
              comentarios: cnpj.comentarios || null,
            }))
          }
        },
        include: {
          credenciamentos: true,
          cnpjsSimulados: true
        }
      })

      console.log('Fechamento criado com sucesso:', fechamento.id)
      return NextResponse.json(fechamento, { status: 201 })
    } catch (createError) {
      console.error('Erro ao criar registro no banco:', createError)
      console.error('Detalhes do erro:', JSON.stringify(createError, Object.getOwnPropertyNames(createError)))
      throw createError
    }
  } catch (error) {
    console.error('Erro ao criar fechamento:', error)
    console.error('Erro completo:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    const errorStack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(
      { error: 'Erro ao salvar fechamento', details: errorMessage, stack: errorStack },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filtro = searchParams.get('filtro') || 'dia'
    const dataParam = searchParams.get('data')
    const regional = searchParams.get('regional') || 'KESIA WEIGE NANDI' // Filtrar por regional
    
    const dataReferencia = dataParam ? new Date(dataParam + 'T12:00:00') : new Date(new Date().toISOString().split('T')[0] + 'T12:00:00')
    
    let startDate: Date
    let endDate: Date
    
    switch (filtro) {
      case 'semana':
        startDate = startOfWeek(dataReferencia, { weekStartsOn: 0 })
        endDate = endOfWeek(dataReferencia, { weekStartsOn: 0 })
        break
      case 'mes':
        startDate = startOfMonth(dataReferencia)
        endDate = endOfMonth(dataReferencia)
        break
      case 'dia':
      default:
        startDate = startOfDay(dataReferencia)
        endDate = endOfDay(dataReferencia)
        break
    }

    // Debug: log das datas para verificar
    console.log('Data referência:', dataReferencia)
    console.log('Start date:', startDate)
    console.log('End date:', endDate)
    console.log('Filtro:', filtro)

    // Primeiro, vamos buscar todos os fechamentos para debug
    const todosFechamentos = await prisma.fechamento.findMany({
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      },
      orderBy: [
        { data: 'desc' }
      ]
    })

    console.log('Todos os fechamentos no banco:', todosFechamentos.map(f => ({ 
      id: f.id, 
      data: f.data, 
      executivo: f.executivo,
      dataISO: f.data.toISOString()
    })))

    const fechamentos = await prisma.fechamento.findMany({
      where: {
        regional: regional, // Filtrar por regional específica
        data: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      },
      orderBy: [
        { data: 'desc' }
      ]
    })

    console.log('Fechamentos encontrados:', fechamentos.length)
    console.log('Fechamentos:', fechamentos.map(f => ({ id: f.id, data: f.data, executivo: f.executivo })))

    return NextResponse.json(fechamentos)
  } catch (error) {
    console.error('Erro ao buscar fechamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fechamentos' },
      { status: 500 }
    )
  }
}

