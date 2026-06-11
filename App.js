import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function App() {
  // Armazena o nome digitado no formulário
  const [nome, setNome] = useState('');

  // Armazena a quantidade digitada no formulário
  const [quantidade, setQuantidade] = useState('');

  // Armazena a lista de materiais recebida da API
  const [materiais, setMateriais] = useState([]);

  // As funções de requisição serão adicionadas aqui nas próximas etapas


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

      {/* Botão obrigatório da Sprint 1 */}
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

      {/* A FlatList exibirá os materiais armazenados no estado */}
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

});