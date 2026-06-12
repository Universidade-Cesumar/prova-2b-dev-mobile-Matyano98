# Sistema Mobile para Almoxarifado de Enfermagem

Aplicativo mobile desenvolvido para modernizar o controle de materiais do almoxarifado do curso técnico de Enfermagem.

O sistema permite consultar o inventário atual e cadastrar novos insumos, como luvas, seringas, máscaras e outros materiais utilizados nas aulas práticas.

## Objetivo do projeto

O projeto tem como objetivo substituir o controle realizado por planilhas por uma aplicação mobile conectada a uma API em nuvem.

A aplicação permite que a responsável pelo almoxarifado consulte e atualize os materiais utilizando um dispositivo móvel enquanto percorre as prateleiras.

## Sprint 1 — Fundação, API e Inventário Mobile

Na primeira sprint foram desenvolvidas as seguintes funcionalidades:

* Formulário para cadastro de materiais;
* Campo para informar o nome do material;
* Campo numérico para informar a quantidade;
* Cadastro de materiais utilizando requisição `POST`;
* Consulta dos materiais utilizando requisição `GET`;
* Carregamento automático do inventário com `useEffect`;
* Exibição dos materiais utilizando `FlatList`;
* Indicador de carregamento durante a consulta da API;
* Validação de campos obrigatórios;
* Bloqueio do botão enquanto o cadastro está sendo realizado;
* Mensagens de sucesso e erro para o usuário.

## Tecnologias utilizadas

* React Native;
* Expo;
* JavaScript;
* React Hooks;
* `useState`;
* `useEffect`;
* Fetch API;
* Async/Await;
* MockAPI.io;
* Git;
* GitHub.

## API

Os dados do inventário são armazenados em uma API REST criada no MockAPI.io.

Endpoint utilizado:

```txt
https://6a2a0285f59cb8f65f1df32a.mockapi.io/api/v1/materiais
```

### Métodos implementados

| Método | Função                                   |
| ------ | ---------------------------------------- |
| `GET`  | Consultar todos os materiais cadastrados |
| `POST` | Cadastrar um novo material               |

### Exemplo de material enviado para a API

```json
{
  "nome": "Luva descartável",
  "quantidade": 50
}
```

A MockAPI gera automaticamente um identificador para cada novo material.

Exemplo de resposta:

```json
{
  "nome": "Luva descartável",
  "quantidade": 50,
  "id": "1"
}
```

## Componentes obrigatórios da Sprint 1

Os componentes principais possuem os identificadores exigidos no contrato técnico:

```jsx
<TextInput testID="input-nome" />
```

```jsx
<TextInput
  testID="input-quantidade"
  keyboardType="numeric"
/>
```

```jsx
<TouchableOpacity testID="btn-cadastrar" />
```

```jsx
<FlatList testID="lista-materiais" />
```

## Como executar o projeto

### Pré-requisitos

Antes de iniciar, é necessário possuir:

* Node.js instalado;
* NPM instalado;
* Git instalado;
* Expo Go no celular, caso utilize um dispositivo físico.

### Clonar o repositório

```bash
git clone https://github.com/Universidade-Cesumar/prova-2b-dev-mobile-Matyano98.git
```

### Entrar na pasta do projeto

```bash
cd prova-2b-dev-mobile-Matyano98
```

### Instalar as dependências

```bash
npm install
```

### Executar o Expo

```bash
npx expo start
```

Depois que o Expo iniciar:

* Pressione `w` para abrir a versão web no navegador;
* Leia o QR Code com o Expo Go para abrir no celular;
* Pressione `r` no terminal para recarregar o aplicativo.

## Como utilizar

1. Aguarde o carregamento dos materiais cadastrados;
2. Digite o nome do material;
3. Digite uma quantidade maior que zero;
4. Pressione o botão **Cadastrar material**;
5. Aguarde a confirmação do cadastro;
6. O novo material será exibido na lista e armazenado na MockAPI.

## Estrutura principal

```txt
prova-2b-dev-mobile-Matyano98/
├── App.js
├── index.js
├── package.json
├── README.md
├── assets/
└── __tests__/
```

O arquivo `App.js` contém a interface, os estados da aplicação, as requisições para a API e a exibição do inventário.

## Status do projeto

Sprint 1 concluída.

As próximas funcionalidades serão implementadas conforme os requisitos apresentados nas próximas sprints.

## Autor

**Mateus Yano**

Curso de Análise e Desenvolvimento de Sistemas — Unicesumar.
