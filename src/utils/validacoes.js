// Função pura responsável por validar uma retirada de estoque
export function validarRetirada(estoqueAtual, quantidadeRetirada) {
  // Converte os valores recebidos para número
  const estoque = Number(estoqueAtual);
  const retirada = Number(quantidadeRetirada);

  // Bloqueia valores inválidos, negativos ou iguais a zero
  if (
    Number.isNaN(estoque) ||
    Number.isNaN(retirada) ||
    retirada <= 0
  ) {
    return false;
  }

  // Permite retirar apenas se houver saldo suficiente no estoque
  return retirada <= estoque;
}