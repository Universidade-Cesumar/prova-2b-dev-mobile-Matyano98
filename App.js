import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
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

  // Controla se os materiais ainda estão sendo buscados
  const [carregando, setCarregando] = useState(true);

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
      // Mostra o erro no terminal caso a requisição falhe
      console.error('Erro ao buscar materiais:', erro);
    } finally {
      // Desativa o indicador mesmo que aconteça algum erro
      setCarregando(false);
    }
  }

        // Envia um novo material para a MockAPI
  async function cadastrarMaterial() {
    // Monta o objeto que será enviado para a API
    const novoMaterial = {
      nome: nome,
      quantidade: Number(quantidade),
    };

    try {
      // Envia os dados usando o método POST
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoMaterial),
      });

      // Verifica se o cadastro foi realizado corretamente
      if (!resposta.ok) {
        throw new Error('Erro ao cadastrar o material.');
      }

      // Converte a resposta da API para JSON
      const materialCadastrado = await resposta.json();

      // Adiciona o novo material ao final da lista atual
      setMateriais((listaAtual) => [
        ...listaAtual,
        materialCadastrado,
      ]);

      // Limpa os campos depois do cadastro
      setNome('');
      setQuantidade('');
    } catch (erro) {
      // Mostra o erro no terminal caso o cadastro falhe
      console.error('Erro ao cadastrar material:', erro);
    }
  }
  // Executa a busca uma vez quando o aplicativo é aberto
  useEffect(() => {
    buscarMateriais();
  }, []);

  // Define como cada material será exibido dentro da FlatList
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

      {/* Campo controlado pelo estado "nome" */}
      <TextInput
        testID="input-nome"
        style={styles.input}
        placeholder="Nome do material"
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo controlado pelo estado "quantidade" */}
      <TextInput
        testID="input-quantidade"
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />

      <TouchableOpacity
        testID="btn-cadastrar"
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Cadastrar material
        </Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>
        Materiais cadastrados
      </Text>

      {/* Verifica se a API ainda está carregando */}
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

  // Define a aparência do botão de cadastro
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  // Define a aparência do texto dentro do botão
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

  // Mensagem apresentada enquanto a lista estiver vazia
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