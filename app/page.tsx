'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getAgenciasPorExecutivo, executivos } from '@/lib/agencias'

// Configuração dos Gerentes Estaduais e suas equipes
const gerentesEstaduais = {
  'KESIA WEIGE NANDI': ['Sheila', 'Jeferson', 'Jhonattan', 'Renan', 'Dionei', 'Cristian'],
  'AMANDA ALINE TRINDADE JUSTI': ['Vitor Hugo', 'Wagner', 'Patricia', 'Augusto', 'Tiago', 'Abner'],
  'ADRIANO CORREA GOMES': ['Vander', 'In Koo', 'Fabio', 'Henrique', 'Paulo', 'Carlos'],
  'BRUNA PASSOS LEMES': ['Raymi', 'William', 'Adler', 'Willyam', 'Alexsandro', 'Cristian Alfonso', 'Kelvin', 'Willian'],
  'GUILHERME MORAES DORNEMANN': ['Ricardo', 'Paola', 'Josimar', 'Edson', 'Fabiele', 'Sabrina'],
  'TBA ESTADUAL BRA PARANA 2': ['Joslayne', 'Lyon', 'Elisandra', 'Jessyka', 'Nicodemos', 'Lilian']
}

// Função para obter GNs de um Gerente Estadual
const getGNsPorGerenteEstadual = (gerente: string) => {
  return gerentesEstaduais[gerente as keyof typeof gerentesEstaduais] || []
}

// Função para obter dados da agência selecionada
const getAgenciaData = (executivo: string, agenciaSelecionada: string) => {
  if (!executivo || !agenciaSelecionada) return null
  
  const agencias = getAgenciasPorExecutivo(executivo)
  const agenciaEncontrada = agencias.find(ag => `${ag.codigo} - ${ag.nome}` === agenciaSelecionada)
  
  return agenciaEncontrada || null
}
import { Plus, Trash2, TrendingUp, Users, Award, Check, Eye, Edit, X } from 'lucide-react'
import { RelatorioSemanal } from '@/components/RelatorioSemanal'
import { RelatorioCompleto } from '@/components/RelatorioCompleto'

// Função para obter foto do GN - Regional Completa
const getFotoGN = (nome: string) => {
  const nomeLimpo = nome.toLowerCase().trim()
  
  // Lista de nomes base para identificar o GN - Regional Completa
  const nomesGN = {
    // EQUIPE KESIA WEIGE NANDI
    'dionei': '/fotos/Dionei.jpeg',
    'sheila': '/fotos/Sheila.jpeg',
    'renan': '/fotos/Renan.jpeg',
    'jeferson': '/fotos/Jeferson.jpeg',
    'jhonattan': '/fotos/Jhonattan.jpeg',
    'cristian': '/fotos/Cristian.jpeg',
    
    // EQUIPE AMANDA ALINE TRINDADE JUSTI
    'vitor hugo': '/fotos/VitorHugo.jpeg',
    'wagner': '/fotos/Wagner.jpeg',
    'patricia': '/fotos/Patricia.jpeg',
    'augusto': '/fotos/Augusto.jpeg',
    'tiago': '/fotos/Tiago.jpeg',
    'abner': '/fotos/Abner.jpeg',
    
    // EQUIPE ADRIANO CORREA GOMES
    'vander': '/fotos/Vander.jpeg',
    'in koo': '/fotos/InKoo.jpeg',
    'fabio': '/fotos/Fabio.jpeg',
    'henrique': '/fotos/Henrique.jpeg',
    'paulo': '/fotos/Paulo.jpeg',
    'carlos': '/fotos/Carlos.jpeg',
    
    // EQUIPE BRUNA PASSOS LEMES
    'raymi': '/fotos/Raymi.jpeg',
    'william': '/fotos/William.jpeg',
    'adler': '/fotos/Adler.jpeg',
    'willyam': '/fotos/Willyam.jpeg',
    'alexsandro': '/fotos/Alexsandro.jpeg',
    'cristian alfonso': '/fotos/CristianAlfonso.jpeg',
    'kelvin': '/fotos/Kelvin.jpeg',
    'willian': '/fotos/Willian.jpeg',
    
    // EQUIPE GUILHERME MORAES DORNEMANN
    'ricardo': '/fotos/Ricardo.jpeg',
    'paola': '/fotos/Paola.jpeg',
    'josimar': '/fotos/Josimar.jpeg',
    'edson': '/fotos/Edson.jpeg',
    'fabiele': '/fotos/Fabiele.jpeg',
    'sabrina': '/fotos/Sabrina.jpeg',
    
    // EQUIPE TBA ESTADUAL BRA PARANA 2
    'joslayne': '/fotos/Joslayne.jpeg',
    'lyon': '/fotos/Lyon.jpeg',
    'elisandra': '/fotos/Elisandra.jpeg',
    'jessyka': '/fotos/Jessyka.jpeg',
    'nicodemos': '/fotos/Nicodemos.jpeg',
    'lilian': '/fotos/Lilian.jpeg'
  }
  
  // Verificar se o nome contém algum dos nomes base
  for (const [nomeBase, foto] of Object.entries(nomesGN)) {
    if (nomeLimpo.includes(nomeBase)) {
      return { tipo: 'foto', src: foto }
    }
  }
  
  // Fallback para avatar com inicial
  const inicial = nome.charAt(0).toUpperCase()
  const cores = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500',
    'bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
  ]
  const corIndex = nome.length % cores.length
  return { tipo: 'avatar', inicial, cor: cores[corIndex] }
}

// Componente para renderizar foto ou avatar
const FotoGN = ({ nome, tamanho = 'md' }: { nome: string, tamanho?: 'sm' | 'md' | 'lg' }) => {
  const foto = getFotoGN(nome)
  const tamanhos = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-12 h-12 sm:w-16 sm:h-16'
  }
  const tamanhosTexto = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-xl sm:text-2xl'
  }

  if (foto.tipo === 'foto') {
    return (
      <img
        src={foto.src}
        alt={nome}
        className={`${tamanhos[tamanho]} rounded-full object-cover border-2 border-white shadow-md`}
        onError={(e) => {
          // Se a foto não carregar, mostra avatar com inicial
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            const fallback = document.createElement('div')
            const avatarData = getFotoGN(nome)
            fallback.className = `${tamanhos[tamanho]} rounded-full ${avatarData.cor} flex items-center justify-center text-white ${tamanhosTexto[tamanho]} font-bold`
            fallback.textContent = avatarData.inicial ?? '?'
            parent.appendChild(fallback)
          }
        }}
      />
    )
  }

  return (
    <div className={`${tamanhos[tamanho]} rounded-full ${foto.cor} flex items-center justify-center text-white ${tamanhosTexto[tamanho]} font-bold`}>
      {foto.inicial ?? '?'}
    </div>
  )
}

type Credenciamento = {
  id: string
  ec: string
  volumeRS: string
  ra: string
  cesta: string
  instalaDireto: string
  nomeGerentePJ: string
}

type CnpjSimulado = {
  id: string
  cnpj: string
  nomeEmpresa: string
  faturamento: string
  comentarios: string
}

type Fechamento = {
  id: string
  executivo: string
  agencia: string
  qtdVisitas: number
  qtdInteracoes: number
  qtdBraExpre: number
  data: string
  credenciamentos: Array<{
    id: string
    qtdCredenciamentos: number
    ativacoesValor: number
    ec: string
    volumeRS: number
    ra: boolean
    cesta: string
    instalaDireto: boolean
    nomeGerentePJ: string
  }>
  cnpjsSimulados: Array<{
    id: string
    cnpj: string
    nomeEmpresa: string
    faturamento: number
    comentarios: string
  }>
}

type RankingItem = {
  executivo: string
  totalCredenciamentos: number
  totalAtivacoes: number
  totalVisitas: number
  totalInteracoes: number
  bateuMeta: boolean
  bateuMetaVisitas: boolean
  posicao?: number
  temEmpate?: boolean
  gnsEmpatados?: string[]
}

export default function Home() {
  const [gerenteEstadual, setGerenteEstadual] = useState('')
  const [executivo, setExecutivo] = useState('')
  const [agencia, setAgencia] = useState('')
  const [porteAgencia, setPorteAgencia] = useState('')
  const [gerentePJ, setGerentePJ] = useState('')
  const [qtdVisitas, setQtdVisitas] = useState('')
  const [qtdInteracoes, setQtdInteracoes] = useState('')
  const [qtdBraExpre, setQtdBraExpre] = useState('')
  const [dataFechamento, setDataFechamento] = useState(new Date().toISOString().split('T')[0])
  const [cnpjsSimulados, setCnpjsSimulados] = useState<CnpjSimulado[]>([])
  const [cnpjsSalvos, setCnpjsSalvos] = useState<CnpjSimulado[]>([])
  const [credenciamentos, setCredenciamentos] = useState<Credenciamento[]>([])
  
  const [fechamentos, setFechamentos] = useState<Fechamento[]>([])
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [filtro, setFiltro] = useState('dia')
  const [dataFiltro, setDataFiltro] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [registroSelecionado, setRegistroSelecionado] = useState<Fechamento | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  // Função para lidar com mudança de Gerente Estadual
  const handleGerenteEstadualChange = (novoGerente: string) => {
    setGerenteEstadual(novoGerente)
    setExecutivo('') // Limpa o executivo quando muda o gerente
    setAgencia('') // Limpa a agência
    setPorteAgencia('') // Limpa o porte
    setGerentePJ('') // Limpa o gerente PJ
  }

  // Função para lidar com mudança de executivo
  const handleExecutivoChange = (novoExecutivo: string) => {
    setExecutivo(novoExecutivo)
    setAgencia('') // Limpa a agência quando muda o executivo
    setPorteAgencia('') // Limpa o porte
    setGerentePJ('') // Limpa o gerente PJ
  }

  const adicionarCredenciamento = () => {
    setCredenciamentos([
      ...credenciamentos,
      {
        id: crypto.randomUUID(),
        ec: '',
        volumeRS: '',
        ra: '',
        cesta: '',
        instalaDireto: '',
        nomeGerentePJ: ''
      }
    ])
  }

  const removerCredenciamento = (id: string) => {
    setCredenciamentos(credenciamentos.filter(c => c.id !== id))
  }

  const atualizarCredenciamento = (id: string, campo: string, valor: string) => {
    setCredenciamentos(credenciamentos.map(c => 
      c.id === id ? { ...c, [campo]: valor } : c
    ))
  }

  const adicionarCnpjSimulado = () => {
    setCnpjsSimulados([
      ...cnpjsSimulados,
      {
        id: crypto.randomUUID(),
        cnpj: '',
        nomeEmpresa: '',
        faturamento: '',
        comentarios: ''
      }
    ])
  }

  const removerCnpjSimulado = (id: string) => {
    setCnpjsSimulados(cnpjsSimulados.filter(c => c.id !== id))
  }

  const atualizarCnpjSimulado = (id: string, campo: string, valor: string) => {
    setCnpjsSimulados(cnpjsSimulados.map(c => 
      c.id === id ? { ...c, [campo]: valor } : c
    ))
  }

  const salvarCnpjSimulado = (id: string) => {
    const cnpjParaSalvar = cnpjsSimulados.find(c => c.id === id)
    if (cnpjParaSalvar && cnpjParaSalvar.cnpj && cnpjParaSalvar.nomeEmpresa && cnpjParaSalvar.faturamento) {
      setCnpjsSalvos([...cnpjsSalvos, cnpjParaSalvar])
      setCnpjsSimulados(cnpjsSimulados.filter(c => c.id !== id))
      alert('CNPJ salvo com sucesso!')
    } else {
      alert('Preencha todos os campos obrigatórios do CNPJ')
    }
  }

  const removerCnpjSalvo = (id: string) => {
    setCnpjsSalvos(cnpjsSalvos.filter(c => c.id !== id))
  }

  const abrirModalRegistro = (fechamento: Fechamento) => {
    setRegistroSelecionado(fechamento)
    setMostrarModal(true)
  }

  const fecharModal = () => {
    setMostrarModal(false)
    setRegistroSelecionado(null)
  }

  const excluirRegistro = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return
    }

    try {
      const response = await fetch(`/api/fechamentos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Registro excluído com sucesso!')
        carregarFechamentos()
        carregarRanking()
        fecharModal()
      } else {
        alert('Erro ao excluir registro')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir registro')
    }
  }

  const editarRegistro = (fechamento: Fechamento) => {
    // Preencher formulário com dados do registro
    setDataFechamento(fechamento.data.split('T')[0])
    setExecutivo(fechamento.executivo)
    setAgencia(fechamento.agencia)
    setQtdVisitas(fechamento.qtdVisitas.toString())
    setQtdInteracoes(fechamento.qtdInteracoes.toString())
    setQtdBraExpre(fechamento.qtdBraExpre.toString())
    
    // Converter credenciamentos para formato do formulário
    const credenciamentosFormatados = fechamento.credenciamentos.map(cred => ({
      id: crypto.randomUUID(),
      ec: cred.ec,
      volumeRS: cred.volumeRS.toString(),
      ra: cred.ra ? 'true' : 'false',
      cesta: cred.cesta,
      instalaDireto: cred.instalaDireto ? 'true' : 'false',
      nomeGerentePJ: cred.nomeGerentePJ || ''
    }))
    setCredenciamentos(credenciamentosFormatados)
    
    // Converter CNPJs simulados para formato do formulário
    const cnpjsFormatados = fechamento.cnpjsSimulados.map(cnpj => ({
      id: crypto.randomUUID(),
      cnpj: cnpj.cnpj,
      nomeEmpresa: cnpj.nomeEmpresa,
      faturamento: cnpj.faturamento.toString(),
      comentarios: cnpj.comentarios || ''
    }))
    setCnpjsSalvos(cnpjsFormatados)
    setCnpjsSimulados([])
    
    // Configurar modo de edição
    setRegistroSelecionado(fechamento)
    setModoEdicao(true)
    fecharModal()
    
    // Ir para aba de lançamento
    const lancamentoTab = document.querySelector('[value="lancamento"]') as HTMLElement
    if (lancamentoTab) {
      lancamentoTab.click()
    }
  }

  const excluirRegistroDireto = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return
    }

    try {
      const response = await fetch(`/api/fechamentos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Registro excluído com sucesso!')
        carregarFechamentos()
        carregarRanking()
      } else {
        alert('Erro ao excluir registro')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir registro')
    }
  }

  const carregarFechamentos = async () => {
    try {
      const response = await fetch(`/api/fechamentos?filtro=${filtro}&data=${dataFiltro}`)
      const data = await response.json()
      setFechamentos(data)
    } catch (error) {
      console.error('Erro ao carregar fechamentos:', error)
    }
  }

  const carregarRanking = async () => {
    try {
      const response = await fetch(`/api/fechamentos/ranking?filtro=${filtro}&data=${dataFiltro}`)
      const data = await response.json()
      setRanking(data)
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
    }
  }

  useEffect(() => {
    carregarFechamentos()
    carregarRanking()
  }, [filtro, dataFiltro])

  // Atualizar porte e gerente PJ quando agência for selecionada
  useEffect(() => {
    if (executivo && agencia) {
      const agenciaData = getAgenciaData(executivo, agencia)
      if (agenciaData) {
        setPorteAgencia((agenciaData as any).porte || '')
        setGerentePJ((agenciaData as any).gerentePJ || '')
      }
    } else {
      setPorteAgencia('')
      setGerentePJ('')
    }
  }, [executivo, agencia])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação
    if (!dataFechamento || !gerenteEstadual || !executivo || !agencia || !qtdVisitas || !qtdInteracoes || !qtdBraExpre) {
      alert('Preencha todos os campos principais')
      return
    }

    // CNPJs Simulados agora são opcionais

    // Debug: verificar credenciamentos
    console.log('🔍 Debug - Credenciamentos no submit:', credenciamentos.length)
    console.log('🔍 Debug - Credenciamentos:', credenciamentos)

    // Se há credenciamentos, validar se estão preenchidos corretamente
    if (credenciamentos.length > 0) {
      const credenciamentosValidos = credenciamentos.every(c => 
        c.ec && c.volumeRS && c.ra && c.cesta && c.instalaDireto
      )

      if (!credenciamentosValidos) {
        alert('Preencha todos os campos de todos os credenciamentos ou remova os credenciamentos vazios')
        return
      }

      // Validar EC (10 dígitos)
      const ecValido = credenciamentos.every(c => c.ec.length === 10 && /^\d+$/.test(c.ec))
      if (!ecValido) {
        alert('O campo EC deve conter exatamente 10 números')
        return
      }
    } else {
      console.log('✅ Nenhum credenciamento - permitindo salvar com zero credenciamentos')
    }

    setLoading(true)

    try {
      let response
      
      if (modoEdicao && registroSelecionado) {
        // Modo edição - atualizar registro existente
        console.log('🔄 Editando registro:', registroSelecionado.id)
        console.log('📝 Modo edição ativo:', modoEdicao)
        console.log('📝 Registro selecionado:', registroSelecionado.executivo)
        console.log('📝 Dados enviados:', {
          executivo,
          agencia,
          qtdVisitas,
          qtdInteracoes,
          qtdBraExpre,
          data: dataFechamento,
          credenciamentos: credenciamentos.length,
          cnpjsSimulados: cnpjsSalvos.length
        })
        
        response = await fetch(`/api/fechamentos/${registroSelecionado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            executivo,
            agencia,
            porteAgencia,
            gerentePJ,
            qtdVisitas: parseInt(qtdVisitas),
            qtdInteracoes: parseInt(qtdInteracoes),
            qtdBraExpre: parseInt(qtdBraExpre),
            data: dataFechamento,
            credenciamentos,
            cnpjsSimulados: cnpjsSalvos
          })
        })
      } else {
        // Modo criação - criar novo registro
        console.log('🆕 Criando novo registro')
        console.log('📝 Modo edição:', modoEdicao)
        console.log('📝 Registro selecionado:', registroSelecionado)
        response = await fetch('/api/fechamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gerenteEstadual,
            executivo,
            agencia,
            porteAgencia,
            gerentePJ,
            qtdVisitas: parseInt(qtdVisitas),
            qtdInteracoes: parseInt(qtdInteracoes),
            qtdBraExpre: parseInt(qtdBraExpre),
            data: dataFechamento,
            credenciamentos,
            cnpjsSimulados: cnpjsSalvos
          })
        })
      }

      if (response.ok) {
        alert(modoEdicao ? 'Fechamento atualizado com sucesso!' : 'Fechamento salvo com sucesso!')
        
        // Limpar formulário
        setDataFechamento(new Date().toISOString().split('T')[0])
        setGerenteEstadual('')
        setExecutivo('')
        setAgencia('')
        setPorteAgencia('')
        setGerentePJ('')
        setQtdVisitas('')
        setQtdInteracoes('')
        setQtdBraExpre('')
        setCnpjsSimulados([])
        setCnpjsSalvos([])
        setCredenciamentos([])
        setModoEdicao(false)
        setRegistroSelecionado(null)
        
        // Recarregar dados
        carregarFechamentos()
        carregarRanking()
      } else {
        const error = await response.json()
        alert('Erro ao salvar: ' + error.error)
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar fechamento')
    } finally {
      setLoading(false)
    }
  }

  const getMeta = () => {
    return filtro === 'dia' ? 2 : filtro === 'semana' ? 10 : 40
  }

  const getMetaVisitas = () => {
    return filtro === 'dia' ? 6 : filtro === 'semana' ? 30 : 120
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Fechamento Diário - CIELO Regional
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Sistema de acompanhamento dos Gerentes de Negócios - Regional Completa</p>
          <img 
            src="/banner-cielo-bradesco.webp" 
            alt="Cielo + Bradesco" 
            className="mx-auto w-full max-w-md h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Banner Cielo e Bradesco */}
        <div className="w-full mb-6 max-w-4xl mx-auto">
          <img 
            src="/banner-cielo-bradesco.webp" 
            alt="Parceria Cielo e Bradesco" 
            className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-lg"
          />
        </div>

        <Tabs defaultValue="lancamento" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-6 sm:mb-8 h-auto">
            <TabsTrigger value="lancamento" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">📝 </span>Lançamento
            </TabsTrigger>
            <TabsTrigger value="ranking" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">📊 </span>Ranking
            </TabsTrigger>
            <TabsTrigger value="relatorio" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">📋 </span>Relatório
            </TabsTrigger>
            <TabsTrigger value="relatorio-completo" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">📊 </span>Prestação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lancamento" className="space-y-4 sm:space-y-8">
            {/* Formulário */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Novo Lançamento</CardTitle>
                <CardDescription className="text-sm">Registre o fechamento do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataFechamento">Data do Fechamento *</Label>
                      <Input
                        id="dataFechamento"
                        type="date"
                        value={dataFechamento}
                        onChange={(e) => setDataFechamento(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gerenteEstadual">Gerente Estadual *</Label>
                      <Select value={gerenteEstadual} onValueChange={handleGerenteEstadualChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Gerente Estadual" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(gerentesEstaduais).map((gerente) => (
                            <SelectItem key={gerente} value={gerente}>{gerente}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="executivo">Executivo (GN) *</Label>
                      {gerenteEstadual ? (
                        <Select value={executivo} onValueChange={handleExecutivoChange} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o GN" />
                          </SelectTrigger>
                          <SelectContent>
                            {getGNsPorGerenteEstadual(gerenteEstadual).map((gn) => (
                              <SelectItem key={gn} value={gn}>{gn}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="executivo"
                          value={executivo}
                          onChange={(e) => setExecutivo(e.target.value)}
                          placeholder="Primeiro selecione o Gerente Estadual"
                          disabled
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência Visitada *</Label>
                      {executivo ? (
                        <Select value={agencia} onValueChange={setAgencia} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a agência" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAgenciasPorExecutivo(executivo).map((ag) => (
                              <SelectItem key={ag.codigo} value={`${ag.codigo} - ${ag.nome}`}>
                                {ag.codigo} - {ag.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="agencia"
                          value={agencia}
                          onChange={(e) => setAgencia(e.target.value)}
                          placeholder="Primeiro selecione o executivo"
                          disabled
                        />
                      )}
                    </div>

                    {/* Campos de Porte e Gerente PJ - aparecem automaticamente quando agência é selecionada */}
                    {agencia && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="space-y-2">
                          <Label htmlFor="porteAgencia">Porte da Agência</Label>
                          <Input
                            id="porteAgencia"
                            value={porteAgencia}
                            readOnly
                            className="bg-white"
                            placeholder="Selecione uma agência"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gerentePJ">Gerente PJ</Label>
                          <Input
                            id="gerentePJ"
                            value={gerentePJ}
                            readOnly
                            className="bg-white"
                            placeholder="Selecione uma agência"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="qtdVisitas">Qtd de Visitas (Presenciais) *</Label>
                      <Input
                        id="qtdVisitas"
                        type="number"
                        value={qtdVisitas}
                        onChange={(e) => setQtdVisitas(e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qtdInteracoes">Qtd de Interações (Ligações + WhatsApp) *</Label>
                      <Input
                        id="qtdInteracoes"
                        type="number"
                        value={qtdInteracoes}
                        onChange={(e) => setQtdInteracoes(e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qtdBraExpre">Qtd Bra Expre Visitado *</Label>
                      <Input
                        id="qtdBraExpre"
                        type="number"
                        value={qtdBraExpre}
                        onChange={(e) => setQtdBraExpre(e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* CNPJs Simulados */}
                  <div className="border-t pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                      <h3 className="text-base sm:text-lg font-semibold">CNPJs Simulados</h3>
                      <Button
                        type="button"
                        onClick={adicionarCnpjSimulado}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="text-sm">Adicionar CNPJ</span>
                      </Button>
                    </div>

      {/* CNPJs Salvos */}
      {cnpjsSalvos.length > 0 ? (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-green-700 mb-3">✅ CNPJs Salvos ({cnpjsSalvos.length})</h4>
                        <div className="space-y-3">
                          {cnpjsSalvos.map((cnpj, index) => (
                            <Card key={cnpj.id} className="bg-green-50 border-green-200">
                              <CardContent className="pt-4 pb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-green-800">CNPJ #{index + 1}: {cnpj.cnpj}</h5>
                                  <Button
                                    type="button"
                                    onClick={() => removerCnpjSalvo(cnpj.id)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="text-sm text-green-700">
                                  <p><strong>Empresa:</strong> {cnpj.nomeEmpresa}</p>
                                  <p><strong>Faturamento:</strong> R$ {parseFloat(cnpj.faturamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                  {cnpj.comentarios && <p><strong>Comentários:</strong> {cnpj.comentarios}</p>}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-gray-600">
                <div className="text-2xl mb-2">📋</div>
                <h4 className="font-semibold mb-2">Nenhum CNPJ Simulado</h4>
                <p className="text-sm">Você pode adicionar CNPJs simulados se desejar.</p>
                <p className="text-xs mt-1 text-gray-500">Clique em "Adicionar CNPJ" se houver simulações.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CNPJs em Edição */}
                    <div className="space-y-4">
                      {cnpjsSimulados.map((cnpj, index) => (
                        <Card key={cnpj.id} className="bg-blue-50 border-blue-200">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium text-blue-800">CNPJ Simulado #{index + 1}</h4>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={() => salvarCnpjSimulado(cnpj.id)}
                                  variant="default"
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Salvar
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => removerCnpjSimulado(cnpj.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              <div className="space-y-2">
                                <Label>CNPJ (apenas números) *</Label>
                                <Input
                                  type="text"
                                  value={cnpj.cnpj}
                                  onChange={(e) => {
                                    const valor = e.target.value.replace(/\D/g, '')
                                    if (valor.length <= 14) {
                                      atualizarCnpjSimulado(cnpj.id, 'cnpj', valor)
                                    }
                                  }}
                                  placeholder="00000000000000"
                                  maxLength={14}
                                  required
                                />
                              </div>

                              <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                                <Label>Nome da Empresa *</Label>
                                <Input
                                  value={cnpj.nomeEmpresa}
                                  onChange={(e) => atualizarCnpjSimulado(cnpj.id, 'nomeEmpresa', e.target.value)}
                                  placeholder="Nome da empresa"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Faturamento (R$) *</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={cnpj.faturamento}
                                  onChange={(e) => atualizarCnpjSimulado(cnpj.id, 'faturamento', e.target.value)}
                                  placeholder="0.00"
                                  min="0"
                                  required
                                />
                              </div>

                              <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                <Label>Comentários sobre a Simulação</Label>
                                <Input
                                  value={cnpj.comentarios}
                                  onChange={(e) => atualizarCnpjSimulado(cnpj.id, 'comentarios', e.target.value)}
                                  placeholder="Descreva os detalhes da simulação realizada"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                      <h3 className="text-base sm:text-lg font-semibold">Credenciamentos</h3>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          type="button"
                          onClick={() => {
                            const confirmar = window.confirm(
                              'Você confirma que hoje não realizou nenhum credenciamento?\n\n' +
                              'Isso irá remover todos os credenciamentos adicionados.'
                            )
                            
                            if (confirmar) {
                              console.log('🔄 Limpando credenciamentos...')
                              console.log('📝 Credenciamentos antes:', credenciamentos.length)
                              setCredenciamentos([])
                              console.log('✅ Credenciamentos limpos!')
                              alert('✅ Credenciamentos removidos! Você pode salvar o fechamento sem credenciamentos.')
                            } else {
                              console.log('❌ Usuário cancelou a limpeza')
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <span className="text-sm">❌ Sem Credenciamentos</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={adicionarCredenciamento}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="text-sm">Adicionar</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {credenciamentos.length === 0 ? (
                        <Card className="bg-gray-50 border-gray-200">
                          <CardContent className="pt-6 pb-6 text-center">
                            <div className="text-gray-600">
                              <div className="text-2xl mb-2">📋</div>
                              <h4 className="font-semibold mb-2">Sem Credenciamentos</h4>
                              <p className="text-sm">Este GN não realizou nenhum credenciamento hoje.</p>
                              <p className="text-xs mt-1 text-gray-500">Clique em "Adicionar" se houver credenciamentos.</p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        credenciamentos.map((cred, index) => (
                        <Card key={cred.id} className="bg-gray-50">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Credenciamento #{index + 1}</h4>
                              {credenciamentos.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removerCredenciamento(cred.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              <div className="space-y-2">
                                <Label>EC (10 números) *</Label>
                                <Input
                                  type="text"
                                  value={cred.ec}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'ec', e.target.value)}
                                  placeholder="0000000000"
                                  maxLength={10}
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Volume R$ *</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={cred.volumeRS}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'volumeRS', e.target.value)}
                                  placeholder="0.00"
                                  min="0"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>RA *</Label>
                                <Select
                                  value={cred.ra}
                                  onValueChange={(value) => atualizarCredenciamento(cred.id, 'ra', value)}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">Sim</SelectItem>
                                    <SelectItem value="false">Não</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Instala Direto *</Label>
                                <Select
                                  value={cred.instalaDireto}
                                  onValueChange={(value) => atualizarCredenciamento(cred.id, 'instalaDireto', value)}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">Sim</SelectItem>
                                    <SelectItem value="false">Não</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Nome do Gerente PJ</Label>
                                <Input
                                  value={cred.nomeGerentePJ}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'nomeGerentePJ', e.target.value)}
                                  placeholder="Nome do gerente PJ que auxiliou"
                                />
                              </div>

                              <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                <Label>Qual Oferta? *</Label>
                                <Input
                                  value={cred.cesta}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'cesta', e.target.value)}
                                  placeholder="Qual oferta foi credenciada?"
                                  required
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        ))
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (modoEdicao ? 'Atualizando...' : 'Salvando...') : (modoEdicao ? 'Atualizar Fechamento' : 'Salvar Fechamento')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Tabela de Registros */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Registros</CardTitle>
                    <CardDescription className="text-sm">Visualize os lançamentos do período</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Label htmlFor="dataFiltro" className="text-xs text-gray-600">Data de Referência</Label>
                      <Input
                        id="dataFiltro"
                        type="date"
                        value={dataFiltro}
                        onChange={(e) => setDataFiltro(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600">Período</Label>
                      <Select value={filtro} onValueChange={setFiltro}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dia">Dia</SelectItem>
                          <SelectItem value="semana">Semana</SelectItem>
                          <SelectItem value="mes">Mês</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => setDataFiltro(new Date().toISOString().split('T')[0])}
                        className="whitespace-nowrap"
                      >
                        Hoje
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {fechamentos.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum registro encontrado</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm sm:text-base">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 text-xs sm:text-sm">Data</th>
                          <th className="text-left p-2 text-xs sm:text-sm">Executivo</th>
                          <th className="text-left p-2 text-xs sm:text-sm hidden sm:table-cell">Agência</th>
                          <th className="text-right p-2 text-xs sm:text-sm">Visitas</th>
                          <th className="text-right p-2 text-xs sm:text-sm hidden md:table-cell">Interações</th>
                          <th className="text-right p-2 text-xs sm:text-sm hidden lg:table-cell">Bra Expre</th>
                          <th className="text-right p-2 text-xs sm:text-sm">Creds</th>
                          <th className="text-right p-2 text-xs sm:text-sm">Total</th>
                          <th className="text-center p-2 text-xs sm:text-sm">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fechamentos.map((fechamento) => {
                          const totalCreds = fechamento.credenciamentos.length
                          const totalAtiv = fechamento.credenciamentos.reduce((sum, c) => sum + c.volumeRS, 0)
                          
                          return (
                            <tr 
                              key={fechamento.id} 
                              className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => abrirModalRegistro(fechamento)}
                            >
                              <td className="p-2 text-xs sm:text-sm">{formatDate(fechamento.data)}</td>
                              <td className="p-2 font-medium text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                  <FotoGN nome={fechamento.executivo} tamanho="sm" />
                                  <span>{fechamento.executivo}</span>
                                </div>
                              </td>
                              <td className="p-2 text-xs sm:text-sm hidden sm:table-cell">{fechamento.agencia}</td>
                              <td className="p-2 text-right text-xs sm:text-sm">
                                <div className="flex flex-col">
                                  <span className="font-semibold">{fechamento.qtdVisitas}</span>
                                  <span className="text-xs text-gray-500">
                                    {Math.round((fechamento.qtdVisitas / 6) * 100)}%
                                  </span>
                                </div>
                              </td>
                              <td className="p-2 text-right text-xs sm:text-sm hidden md:table-cell">{fechamento.qtdInteracoes}</td>
                              <td className="p-2 text-right text-xs sm:text-sm hidden lg:table-cell">{fechamento.qtdBraExpre}</td>
                              <td className="p-2 text-right font-semibold text-xs sm:text-sm">{totalCreds}</td>
                              <td className="p-2 text-right text-green-600 font-semibold text-xs sm:text-sm">
                                {formatCurrency(totalAtiv)}
                              </td>
                              <td className="p-2 text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      abrirModalRegistro(fechamento)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="w-4 h-4 text-blue-500" />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      editarRegistro(fechamento)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="w-4 h-4 text-green-500" />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      excluirRegistroDireto(fechamento.id)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking" className="space-y-4 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold">🏆 Ranking dos GNs</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="dataFiltroRanking" className="text-xs text-gray-600">Data de Referência</Label>
                  <Input
                    id="dataFiltroRanking"
                    type="date"
                    value={dataFiltro}
                    onChange={(e) => setDataFiltro(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-600">Período</Label>
                  <Select value={filtro} onValueChange={setFiltro}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dia">Dia</SelectItem>
                      <SelectItem value="semana">Semana</SelectItem>
                      <SelectItem value="mes">Mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => setDataFiltro(new Date().toISOString().split('T')[0])}
                    className="whitespace-nowrap"
                  >
                    Hoje
                  </Button>
                </div>
              </div>
            </div>

            {/* Cards de Destaque */}
            {ranking.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* Card Maior Quantidade - Compacto */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-yellow-900 text-lg">🏆</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-yellow-700">Maior Quantidade</div>
                      <div className="text-xs text-yellow-600">
                        {filtro === 'dia' ? `Dia ${formatDate(dataFiltro)}` : 
                         filtro === 'semana' ? `Semana ${formatDate(dataFiltro)}` : 
                         formatDate(dataFiltro, { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    {(() => {
                      const maxCreds = Math.max(...ranking.map(gn => gn.totalCredenciamentos))
                      const gnsEmpatados = ranking.filter(gn => gn.totalCredenciamentos === maxCreds)
                      
                      if (gnsEmpatados.length === 1) {
                        return (
                          <div className="flex items-center gap-3">
                            <FotoGN nome={gnsEmpatados[0].executivo} tamanho="sm" />
                            <div className="flex-1">
                              <div className="font-bold text-yellow-700 text-sm">{gnsEmpatados[0].executivo}</div>
                              <div className="text-xs text-yellow-600">{gnsEmpatados[0].totalCredenciamentos} creds</div>
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <div className="space-y-2">
                            <div className="text-xs text-yellow-600 font-medium">
                              {gnsEmpatados.length} GNs empatados com {maxCreds} creds
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {gnsEmpatados.map((gn, index) => (
                                <div key={gn.executivo} className="flex items-center gap-2 bg-yellow-100 rounded-lg px-2 py-1">
                                  <FotoGN nome={gn.executivo} tamanho="sm" />
                                  <span className="text-xs font-medium text-yellow-700">{gn.executivo}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </div>

                {/* Card Maior Volume - Compacto */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-green-900 text-lg">💰</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-green-700">Maior Volume</div>
                      <div className="text-xs text-green-600">
                        {filtro === 'dia' ? `Dia ${formatDate(dataFiltro)}` : 
                         filtro === 'semana' ? `Semana ${formatDate(dataFiltro)}` : 
                         formatDate(dataFiltro, { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    {(() => {
                      const maxVolume = Math.max(...ranking.map(gn => gn.totalAtivacoes))
                      const gnsEmpatadosVolume = ranking.filter(gn => gn.totalAtivacoes === maxVolume)
                      
                      if (gnsEmpatadosVolume.length === 1) {
                        return (
                          <div className="flex items-center gap-3">
                            <FotoGN nome={gnsEmpatadosVolume[0].executivo} tamanho="sm" />
                            <div className="flex-1">
                              <div className="font-bold text-green-700 text-sm">{gnsEmpatadosVolume[0].executivo}</div>
                              <div className="text-xs text-green-600">{formatCurrency(gnsEmpatadosVolume[0].totalAtivacoes)}</div>
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <div className="space-y-2">
                            <div className="text-xs text-green-600 font-medium">
                              {gnsEmpatadosVolume.length} GNs empatados com {formatCurrency(maxVolume)}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {gnsEmpatadosVolume.map((gn, index) => (
                                <div key={gn.executivo} className="flex items-center gap-2 bg-green-100 rounded-lg px-2 py-1">
                                  <FotoGN nome={gn.executivo} tamanho="sm" />
                                  <span className="text-xs font-medium text-green-700">{gn.executivo}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Aviso para Relatório Semanal */}
            {filtro === 'semana' && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">📊</span>
                    <div>
                      <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Relatório Semanal</h3>
                      <p className="text-xs sm:text-sm text-blue-600">
                        Este ranking será enviado toda sexta-feira após o preenchimento dos dias úteis (segunda a sexta).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {ranking.length === 0 ? (
              <Card>
                <CardContent className="py-8 sm:py-12">
                  <p className="text-center text-gray-500 text-sm sm:text-base">Nenhum dado disponível para o período selecionado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {ranking.map((item, index) => {
                  // Usar posição calculada pela API
                  const posicaoReal = item.posicao || (index + 1)
                  const isPrimeiroLugar = posicaoReal === 1
                  const isSegundoLugar = posicaoReal === 2
                  const isTerceiroLugar = posicaoReal === 3
                  const temEmpate = item.temEmpate || false
                  
                  return (
                    <div 
                      key={item.executivo} 
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-sm ${
                        isPrimeiroLugar ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200' :
                        isSegundoLugar ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' :
                        isTerceiroLugar ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200' :
                        item.totalCredenciamentos === 0 ? 'bg-red-50 border-red-200' :
                        'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Posição e Foto */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isPrimeiroLugar ? 'bg-yellow-400 text-yellow-900' :
                          isSegundoLugar ? 'bg-gray-400 text-gray-900' :
                          isTerceiroLugar ? 'bg-orange-400 text-orange-900' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {isPrimeiroLugar ? '🥇' : isSegundoLugar ? '🥈' : isTerceiroLugar ? '🥉' : posicaoReal}
                          {temEmpate && <span className="text-xs ml-1">=</span>}
                        </div>
                      <FotoGN nome={item.executivo} tamanho="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{item.executivo}</h3>
                          {temEmpate && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              EMPATE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {item.bateuMeta ? (
                            <span className="text-xs text-green-600 font-medium">✅ Meta</span>
                          ) : item.totalCredenciamentos === 0 ? (
                            <span className="text-xs text-red-600 font-medium">❌ Zerado</span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Creds</div>
                        <div className="text-sm font-bold text-blue-600">
                          {item.totalCredenciamentos}
                          <span className="text-xs text-gray-400">/{getMeta()}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Visitas</div>
                        <div className="text-sm font-bold text-purple-600">
                          {item.totalVisitas}
                          <span className="text-xs text-gray-400">/{getMetaVisitas()}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Volume</div>
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(item.totalAtivacoes)}
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="relatorio" className="space-y-4 sm:space-y-8">
            <RelatorioSemanal />
          </TabsContent>

          <TabsContent value="relatorio-completo" className="space-y-4 sm:space-y-8">
            <RelatorioCompleto />
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes do Registro - Design Moderno */}
        {mostrarModal && registroSelecionado && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header com gradiente */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <FotoGN nome={registroSelecionado.executivo} tamanho="lg" />
                    <div>
                      <h2 className="text-2xl font-bold">{registroSelecionado.executivo}</h2>
                      <p className="text-blue-100">{registroSelecionado.agencia}</p>
                      <p className="text-blue-200 text-sm">{formatDate(registroSelecionado.data)}</p>
                    </div>
                  </div>
                  <Button onClick={fecharModal} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Métricas Principais */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 text-xl">👥</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">{registroSelecionado.qtdVisitas}</div>
                    <div className="text-sm text-blue-600">Visitas</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 text-xl">📞</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">{registroSelecionado.qtdInteracoes}</div>
                    <div className="text-sm text-green-600">Interações</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 text-xl">🏢</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">{registroSelecionado.qtdBraExpre}</div>
                    <div className="text-sm text-purple-600">Bra Expre</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-600 text-xl">📋</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700">{registroSelecionado.credenciamentos.length}</div>
                    <div className="text-sm text-orange-600">Credenciamentos</div>
                  </div>
                </div>

                {/* Credenciamentos */}
                {registroSelecionado.credenciamentos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-3xl">📋</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum Credenciamento</h3>
                    <p className="text-gray-500">Este registro não possui credenciamentos cadastrados.</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600">📋</span>
                      </span>
                      Credenciamentos ({registroSelecionado.credenciamentos.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {registroSelecionado.credenciamentos.map((cred, index) => (
                        <div key={cred.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-bold">#{index + 1}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900">Credenciamento #{index + 1}</h4>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-blue-600 font-medium mb-1">EC</p>
                                <p className="font-bold text-blue-700">{cred.ec}</p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-xs text-green-600 font-medium mb-1">Volume</p>
                                <p className="font-bold text-green-700">{formatCurrency(cred.volumeRS)}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-xs text-purple-600 font-medium mb-1">RA</p>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${cred.ra ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  <p className="font-semibold text-purple-700">{cred.ra ? 'Sim' : 'Não'}</p>
                                </div>
                              </div>
                              <div className="bg-orange-50 rounded-lg p-3">
                                <p className="text-xs text-orange-600 font-medium mb-1">Instala Direto</p>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${cred.instalaDireto ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  <p className="font-semibold text-orange-700">{cred.instalaDireto ? 'Sim' : 'Não'}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600 font-medium mb-1">Qual Oferta?</p>
                              <p className="font-semibold text-gray-700">{cred.cesta}</p>
                            </div>
                            
                            {cred.nomeGerentePJ && (
                              <div className="bg-indigo-50 rounded-lg p-3">
                                <p className="text-xs text-indigo-600 font-medium mb-1">Gerente PJ</p>
                                <p className="font-semibold text-indigo-700">{cred.nomeGerentePJ}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CNPJs Simulados */}
                {registroSelecionado.cnpjsSimulados.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600">🏢</span>
                      </span>
                      CNPJs Simulados ({registroSelecionado.cnpjsSimulados.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {registroSelecionado.cnpjsSimulados.map((cnpj, index) => (
                        <div key={cnpj.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">#{index + 1}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900">CNPJ #{index + 1}</h4>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs text-blue-600 font-medium mb-1">CNPJ</p>
                              <p className="font-bold text-blue-700">{cnpj.cnpj}</p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs text-green-600 font-medium mb-1">Empresa</p>
                              <p className="font-bold text-green-700">{cnpj.nomeEmpresa}</p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs text-purple-600 font-medium mb-1">Faturamento</p>
                              <p className="font-bold text-purple-700">{formatCurrency(cnpj.faturamento)}</p>
                            </div>
                            
                            {cnpj.comentarios && (
                              <div className="bg-white rounded-lg p-3">
                                <p className="text-xs text-gray-600 font-medium mb-1">Comentários</p>
                                <p className="font-semibold text-gray-700">{cnpj.comentarios}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Button onClick={() => excluirRegistro(registroSelecionado.id)} variant="destructive" className="hover:bg-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Registro
                  </Button>
                  <Button onClick={fecharModal} variant="outline" className="hover:bg-blue-50 hover:border-blue-200">
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

