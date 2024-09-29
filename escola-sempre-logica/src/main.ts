class Aluno {
  nome: string;
  sobrenome: string;
  email: string;
  tipo: 'presencial' | 'ead';
  turma: number; // readonly
  nascimento: Date;
  notas: number[] = [];
  ativo: boolean = true;

  constructor(
      nome: string,
      sobrenome: string,
      email: string,
      tipo: 'presencial' | 'ead',
      turma: number,
      nascimento: Date,
      notas?: number[]
  ) {
      this.nome = nome;
      this.sobrenome = sobrenome;
      this.email = email;
      this.tipo = tipo;
      this.turma = turma;
      this.nascimento = nascimento;

      if (notas && notas.length <= 5) {
          this.notas = notas;
      }
  }
}

class Turma {
  codigo: number;
  maximo: number;
  alunos: Aluno[] = [];
  descricao: string;
  tipo: 'presencial' | 'ead';

  constructor(codigo: number, maximo: number, descricao: string, tipo: 'presencial' | 'ead') {
      if (codigo < 1 || codigo > 10) {
          throw new Error("Código da turma deve ser entre 1 e 10.");
      }

      if (maximo < 5 || maximo > 10) {
          throw new Error("Número máximo de alunos deve ser entre 5 e 10.");
      }

      this.codigo = codigo;
      this.maximo = maximo;
      this.descricao = descricao;
      this.tipo = tipo;
  }

  adicionarAluno(aluno: Aluno): void {
      if (this.alunos.length >= this.maximo) {
          throw new Error("Número máximo de alunos atingido para esta turma.");
      }

      if (aluno.turma !== this.codigo) {
          throw new Error("O aluno deve ser cadastrado na turma correspondente.");
      }

      this.alunos.push(aluno);
  }
}

// Exemplo de uso
const turma1 = new Turma(1, 10, "Turma de Matemática", "presencial");

const aluno1 = new Aluno("João", "Silva", "joao.silva@email.com", "presencial", 1, new Date(2005, 5, 15), [8, 9, 10]);

turma1.adicionarAluno(aluno1);

console.log(turma1);

