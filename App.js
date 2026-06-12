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
      // Desativa o indicador mesmo que aconteça algum erro
      setCarregando(false);
    }
  }

  // Envia um novo material para a MockAPI
  async function cadastrarMaterial() {
    // Remove espaços no começo e no final do nome
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

    // Objeto JSON que será enviado para a API
    const novoMaterial = {
      nome: nomeLimpo,
      quantidade: quantidadeNumerica,
    };

    try {
      // Desabilita o botão enquanto o POST acontece
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

      // Recebe o material criado, incluindo o ID
      const materialCadastrado =
        await resposta.json();

      // Adiciona o novo material ao final da FlatList
      setMateriais((listaAtual) => [
        ...listaAtual,
        materialCadastrado,
      ]);

      // Limpa os campos depois do cadastro
      setNome('');
      setQuantidade('');

      // Informa que o cadastro funcionou
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

      // Informa o problema para o usuário
      Alert.alert(
        'Erro',
        'Não foi possível cadastrar o material.'
      );
    } finally {
      // Reativa o botão após terminar o cadastro
      setCadastrando(false);
    }
  }

  // Executa o GET uma única vez quando o aplicativo é aberto
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

      {/* Exibe o carregamento ou a lista de materiais */}
      {carregando ? (
        <ActivityIndicator
          size="large"
          style={styles.loading}
        />
      ) : (
        <FlatList
          testID="lista-materiais"
          data={materiais}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderizarMaterial}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum material cadastrado.
            </Text>
          }
        />
      )}
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

  // Espaçamento interno da lista
  listContent: {
    paddingBottom: 30,
  },

  // Card usado para mostrar cada material
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

  // Mensagem apresentada quando não existem materiais
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