import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    console.log('🔄 API PUT - Atualizando registro:', id)
    
    const { executivo, agencia, qtdVisitas, qtdInteracoes, qtdBraExpre, data, credenciamentos, cnpjsSimulados } = body
    
    console.log('📝 Dados recebidos:', { executivo, agencia, qtdVisitas, qtdInteracoes, qtdBraExpre, data })

    // Validação básica
    if (!executivo || !agencia || qtdVisitas === undefined || qtdInteracoes === undefined || qtdBraExpre === undefined) {
      return NextResponse.json(
        { error: 'Todos os campos principais são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o fechamento existe
    const fechamentoExistente = await prisma.fechamento.findUnique({
      where: { id },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      }
    })

    if (!fechamentoExistente) {
      return NextResponse.json(
        { error: 'Fechamento não encontrado' },
        { status: 404 }
      )
    }

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

    // Atualizar fechamento com credenciamentos e CNPJs simulados
    const fechamento = await prisma.fechamento.update({
      where: { id },
      data: {
        executivo,
        agencia,
        qtdVisitas: parseInt(qtdVisitas),
        qtdInteracoes: parseInt(qtdInteracoes),
        qtdBraExpre: parseInt(qtdBraExpre),
        data: data ? new Date(data + 'T12:00:00') : fechamentoExistente.data,
        credenciamentos: {
          deleteMany: {},
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
          deleteMany: {},
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

    return NextResponse.json(fechamento, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar fechamento:', error)
    console.error('Erro completo:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Erro ao atualizar fechamento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se o fechamento existe
    const fechamento = await prisma.fechamento.findUnique({
      where: { id },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      }
    })

    if (!fechamento) {
      return NextResponse.json(
        { error: 'Fechamento não encontrado' },
        { status: 404 }
      )
    }

    // Excluir o fechamento (os credenciamentos e CNPJs serão excluídos automaticamente devido ao onDelete: Cascade)
    await prisma.fechamento.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Fechamento excluído com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao excluir fechamento:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir fechamento' },
      { status: 500 }
    )
  }
}
