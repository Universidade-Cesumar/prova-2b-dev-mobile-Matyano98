import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

// Importa a função pura que valida se a retirada é permitida
import { validarRetirada } from './src/utils/validacoes';

// Endpoint usado para buscar e cadastrar materiais
const API_URL =
  'https://6a2a0285f59cb8f65f1df32a.mockapi.io/api/v1/materiais';

export default function App() {
  // Armazena o nome digitado no formulário
  const [nome, setNome] = useState('');

  // Armazena a quantidade digitada no formulário
  const [quantidade, setQuantidade] = useState('');

  // Armazena a lista de materiais recebida da API
  const [materiais, setMateriais] = useState([]);

  // Controla o carregamento inicial do inventário
  const [carregando, setCarregando] = useState(true);

  // Impede vários cliques enquanto o material está sendo enviado
  const [cadastrando, setCadastrando] = useState(false);

  // Armazena a quantidade que será retirada de cada material
  // O id do material será usado como chave do objeto
  const [retiradas, setRetiradas] = useState({});

  // Busca todos os materiais cadastrados na MockAPI
  async function buscarMateriais() {
    try {
      // Ativa o indicador antes de iniciar a requisição
      setCarregando(true);

      // Realiza uma requisição GET para o endpoint
      const resposta = await fetch(API_URL);

      // Verifica se a API respondeu corretamente
      if (!resposta.ok) {
        throw new Error('Erro ao buscar os materiais.');
      }

      // Converte a resposta da API para JSON
      const dados = await resposta.json();

      // Guarda os materiais no estado da aplicação
      setMateriais(dados);
    } catch (erro) {
      // Exibe o erro no console
      console.error('Erro ao buscar materiais:', erro);

      // Informa o problema para o usuário
      Alert.alert(
        'Erro',
        'Não foi possível carregar os materiais.'
      );
    } finally {
      // Desativa o carregamento com sucesso ou erro
      setCarregando(false);
    }
  }

  // Envia um novo material para a MockAPI
  async function cadastrarMaterial() {
    // Remove espaços do começo e do final do nome
    const nomeLimpo = nome.trim();

    // Converte a quantidade de texto para número
    const quantidadeNumerica = Number(quantidade);

    // Impede o cadastro com campos vazios
    if (!nomeLimpo || !quantidade) {
      Alert.alert(
        'Atenção',
        'Preencha o nome e a quantidade.'
      );

      return;
    }

    // Impede quantidade igual a zero, negativa ou inválida
    if (
      Number.isNaN(quantidadeNumerica) ||
      quantidadeNumerica <= 0
    ) {
      Alert.alert(
        'Atenção',
        'Digite uma quantidade maior que zero.'
      );

      return;
    }

    // Objeto que será transformado em JSON
    const novoMaterial = {
      nome: nomeLimpo,
      quantidade: quantidadeNumerica,
    };

    try {
      // Desabilita o botão durante o cadastro
      setCadastrando(true);

      // Envia o material usando o método POST
      const resposta = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(novoMaterial),
      });

      // Verifica se a API aceitou o cadastro
      if (!resposta.ok) {
        const mensagemErro = await resposta.text();

        throw new Error(
          `Erro ${resposta.status}: ${mensagemErro}`
        );
      }

      // Recebe o material criado com o ID da MockAPI
      const materialCadastrado =
        await resposta.json();

      // Adiciona o novo material ao final da lista
      setMateriais((listaAtual) => [
        ...listaAtual,
        materialCadastrado,
      ]);

      // Limpa os campos depois do cadastro
      setNome('');
      setQuantidade('');

      // Informa que o cadastro foi concluído
      Alert.alert(
        'Sucesso',
        'Material cadastrado com sucesso.'
      );
    } catch (erro) {
      // Exibe detalhes do erro no console
      console.error(
        'Erro ao cadastrar material:',
        erro
      );

      // Informa o erro para o usuário
      Alert.alert(
        'Erro',
        'Não foi possível cadastrar o material.'
      );
    } finally {
      // Reativa o botão após terminar a requisição
      setCadastrando(false);
    }
  }

  // Realiza a baixa de estoque de um material
async function baixarMaterial(item) {
  // Pega a quantidade digitada no campo de retirada daquele item
  const quantidadeDigitada = retiradas[item.id];

  // Converte o estoque atual e a quantidade retirada para número
  const estoqueAtual = Number(item.quantidade);
  const quantidadeRetirada = Number(quantidadeDigitada);

  // Usa a função pura da Sprint 2 para validar a operação
  const retiradaValida = validarRetirada(
    estoqueAtual,
    quantidadeRetirada
  );

  // Bloqueia retiradas vazias, negativas, zeradas ou maiores que o estoque
  if (!retiradaValida) {
    Alert.alert(
      'Atenção',
      'Quantidade de retirada inválida ou maior que o estoque disponível.'
    );

    return;
  }

  // Calcula o novo saldo do material
  const novaQuantidade = estoqueAtual - quantidadeRetirada;

  // Monta o objeto atualizado que será enviado para a MockAPI
  const materialAtualizado = {
    ...item,
    quantidade: novaQuantidade,
  };

  try {
    // Envia a atualização do material para a MockAPI
    const resposta = await fetch(`${API_URL}/${item.id}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(materialAtualizado),
    });

    // Verifica se a API aceitou a atualização
    if (!resposta.ok) {
      throw new Error('Erro ao baixar o estoque.');
    }

    // Recebe o material atualizado pela MockAPI
    const materialAtualizadoApi = await resposta.json();

    // Atualiza a lista local trocando apenas o item alterado
    setMateriais((listaAtual) =>
      listaAtual.map((material) =>
        material.id === item.id
          ? materialAtualizadoApi
          : material
      )
    );

    // Limpa o campo de retirada daquele material
    setRetiradas((retiradasAtuais) => ({
      ...retiradasAtuais,
      [item.id]: '',
    }));

    Alert.alert(
      'Sucesso',
      'Baixa de estoque realizada com sucesso.'
    );
  } catch (erro) {
    console.error(
      'Erro ao baixar estoque:',
      erro
    );

    Alert.alert(
      'Erro',
      'Não foi possível realizar a baixa de estoque.'
    );
  }
}


// Remove um material da MockAPI e da lista local
async function excluirMaterial(item) {
  try {
    // Envia a requisição DELETE para remover o item pelo ID
    const resposta = await fetch(`${API_URL}/${item.id}`, {
      method: 'DELETE',
    });

    // Verifica se a API aceitou a exclusão
    if (!resposta.ok) {
      throw new Error('Erro ao excluir o material.');
    }

    // Remove o material excluído da lista exibida na tela
    setMateriais((listaAtual) =>
      listaAtual.filter((material) => material.id !== item.id)
    );

    // Limpa também o campo de retirada relacionado ao item excluído
    setRetiradas((retiradasAtuais) => {
      const novasRetiradas = { ...retiradasAtuais };

      delete novasRetiradas[item.id];

      return novasRetiradas;
    });

    Alert.alert(
      'Sucesso',
      'Material excluído com sucesso.'
    );
  } catch (erro) {
    console.error(
      'Erro ao excluir material:',
      erro
    );

    Alert.alert(
      'Erro',
      'Não foi possível excluir o material.'
    );
  }
}

  // Executa o GET uma vez quando o aplicativo é aberto
  useEffect(() => {
    buscarMateriais();
  }, []);

 // Define como cada material será exibido na FlatList
function renderizarMaterial({ item }) {
  return (
    <View style={styles.materialCard}>
      <Text style={styles.materialNome}>
        {item.nome}
      </Text>

      <Text style={styles.materialQuantidade}>
        Quantidade: {item.quantidade}
      </Text>

      {/* Campo usado para informar quanto será retirado deste item */}
      <TextInput
        testID="input-retirada"
        style={styles.inputRetirada}
        placeholder="Quantidade para retirar"
        value={retiradas[item.id] || ''}
        onChangeText={(valor) =>
          setRetiradas((retiradasAtuais) => ({
            ...retiradasAtuais,
            [item.id]: valor,
          }))
        }
        keyboardType="numeric"
      />
       {/* Área dos botões de ação do material */}
      <View style={styles.actionContainer}>
        {/* Botão obrigatório para confirmar a baixa de estoque */}
        <TouchableOpacity
          testID="btn-baixar"
          style={styles.baixarButton}
          onPress={() => baixarMaterial(item)}
        >
          <Text style={styles.actionButtonText}>
            Baixar
          </Text>
        </TouchableOpacity>

        {/* Botão obrigatório para excluir o material */}
        <TouchableOpacity
          testID="btn-excluir"
          style={styles.excluirButton}
          onPress={() => excluirMaterial(item)}
        >
          <Text style={styles.actionButtonText}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Almoxarifado - Enfermagem
      </Text>

      <Text style={styles.description}>
        Este template servirá para desenvolver o projeto responsável por
        modernizar o controle de insumos médicos do almoxarifado.
        Através desta interface conectada à API, é possível realizar o
        inventário em tempo real, cadastrar novos materiais e registrar
        baixas de estoque de forma ágil e segura.
      </Text>

      {/* Campo obrigatório para o nome do material */}
      <TextInput
        testID="input-nome"
        style={styles.input}
        placeholder="Nome do material"
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo obrigatório para a quantidade */}
      <TextInput
        testID="input-quantidade"
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />

      {/* Botão obrigatório conectado à função POST */}
      <TouchableOpacity
        testID="btn-cadastrar"
        style={[
          styles.button,
          cadastrando && styles.buttonDisabled,
        ]}
        onPress={cadastrarMaterial}
        disabled={cadastrando}
      >
        <Text style={styles.buttonText}>
          {cadastrando
            ? 'Cadastrando...'
            : 'Cadastrar material'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>
        Materiais cadastrados
      </Text>

      {/* Mostra o indicador enquanto o GET está acontecendo */}
      {carregando && (
        <ActivityIndicator
          size="large"
          style={styles.loading}
        />
      )}

      {/*
        Esta View possui o testID usado pelo teste automatizado.
        A FlatList abaixo mantém o testID obrigatório do contrato.
      */}
      <View
        testID="lista-materials"
        style={styles.listWrapper}
      >
        <FlatList
          testID="lista-materiais"
          data={materiais}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderizarMaterial}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !carregando ? (
              <Text style={styles.emptyText}>
                Nenhum material cadastrado.
              </Text>
            ) : null
          }
        />
      </View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },

  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },

  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  // Aparência principal do botão
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  // Deixa o botão mais claro durante o cadastro
  buttonDisabled: {
    opacity: 0.6,
  },

  // Aparência do texto dentro do botão
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Título exibido acima da lista
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  // Permite que a lista ocupe o restante da tela
  listWrapper: {
    flex: 1,
  },

  // Espaçamento interno da lista
  listContent: {
    paddingBottom: 30,
  },

  // Card utilizado para exibir cada material
  materialCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },

  // Nome do material dentro do card
  materialNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Quantidade do material dentro do card
  materialQuantidade: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Campo usado dentro de cada card para informar a quantidade da baixa
inputRetirada: {
  height: 42,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  paddingHorizontal: 10,
  marginTop: 10,
  backgroundColor: '#fff',
},

// Organiza os botões de baixa e exclusão lado a lado
actionContainer: {
  flexDirection: 'row',
  gap: 10,
  marginTop: 10,
},

// Botão usado para confirmar a baixa de estoque
baixarButton: {
  flex: 1,
  height: 42,
  backgroundColor: '#16a34a',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},

// Botão usado para excluir um material
excluirButton: {
  flex: 1,
  height: 42,
  backgroundColor: '#dc2626',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},

// Texto dos botões de ação
actionButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},

  // Mensagem apresentada quando a lista está vazia
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },

  // Posiciona o indicador de carregamento
  loading: {
    marginTop: 20,
  },
});