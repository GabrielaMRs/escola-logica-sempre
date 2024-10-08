interface IAluno {
    nome: string;
    sobrenome: string;
    email: string;
    tipo: 'presencial' | 'ead';
    turma: number; // readonly
    nascimento: Date;
    notas: number[];
    ativo: boolean;

    calcularMedia(): number;
    verificarSituacao(): string;
}

interface ITurma {
    codigo: number;
    maximo: number;
    descricao: string;
    tipo: 'presencial' | 'ead';
    alunos: IAluno[];

    adicionarAluno(aluno: IAluno): void;
    removerAluno(email: string): void;
    atualizarAluno(email: string, novosDados: Partial<IAluno>): void;
    buscarAluno(email: string): IAluno | undefined;
    listarAlunos(): IAluno[];
    contarAlunos(): number;
}

class Aluno implements IAluno {
    public nome: string;
    public sobrenome: string;
    public email: string;
    public tipo: 'presencial' | 'ead';
    public readonly turma: number;
    public nascimento: Date;
    public notas: number[] = [];
    public ativo: boolean = true;

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

        if (new Date().getFullYear() - nascimento.getFullYear() < 16) {
            throw new Error("O aluno deve ter pelo menos 16 anos.");
        }
    }

    public desativarAluno(): void {
        this.ativo = false;
    }

    public ativarAluno(): void {
        this.ativo = true;
    }

    public calcularMedia(): number {
        const soma = this.notas.reduce((acc, nota) => acc + nota, 0);
        return this.notas.length > 0 ? soma / this.notas.length : 0;
    }

    public verificarSituacao(): string {
        const media = this.calcularMedia();
        if (media > 6) {
            return `${this.nome} ${this.sobrenome} está acima da média.`;
        } else if (media < 6) {
            return `${this.nome} ${this.sobrenome} está abaixo da média.`;
        } else {
            return `${this.nome} ${this.sobrenome} está na média.`;
        }
    }
}

class Turma implements ITurma {
    public codigo: number;
    public maximo: number;
    public descricao: string;
    public tipo: 'presencial' | 'ead';
    public alunos: Aluno[] = []; // Mudando para público

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

    public adicionarAluno(aluno: Aluno): void {
        if (this.alunos.length >= this.maximo) {
            throw new Error("Número máximo de alunos atingido para esta turma.");
        }

        if (aluno.turma !== this.codigo) {
            throw new Error("O aluno deve ser cadastrado na turma correspondente.");
        }

        const alunoExistente = this.alunos.find(a => a.email === aluno.email);
        if (alunoExistente) {
            throw new Error("Esse email já foi cadastrado para um aluno.")
        }

        if (aluno.tipo !== this.tipo) {
            throw new Error("O aluno não pode ser cadastrado em uma turma de modalidade diferente da sua de origem.")
        }

        this.alunos.push(aluno);
    }

    public removerAluno(email: string): void {
        const index = this.alunos.findIndex(aluno => aluno.email === email);

        if (index !== -1) {
            this.alunos.splice(index, 1);
        } else {
            throw new Error("Aluno não encontrado.");
        }
    }

    public atualizarAluno(email: string, novosDados: Partial<IAluno>): void {
        const aluno = this.alunos.find(aluno => aluno.email === email);
        if (aluno) {
            Object.assign(aluno, novosDados);
        } else {
            throw new Error("Aluno não encontrado.");
        }
    }

    public buscarAluno(email: string): IAluno | undefined {
        return this.alunos.find(aluno => aluno.email === email);
    }

    public listarAlunos(): IAluno[] {
        return this.alunos;
    }

    public contarAlunos(): number {
        return this.alunos.length;
    }
}

class Escola {
    public nome: string;
    private turmas: Turma[] = [];

    constructor(nome: string) {
        this.nome = nome;
    }

    public adicionarTurma(turma: Turma): void {
        if (this.turmas.length >= 10) {
            throw new Error("Não é possível adicionar mais de 10 turmas.");
        }

        const turmaExistente = this.turmas.find(t => t.codigo === turma.codigo);
        if (turmaExistente) {
            throw new Error("Código de turma já existente.");
        }

        this.turmas.push(turma);
    }

    public removerTurma(codigo: number): void {
        const index = this.turmas.findIndex(turma => turma.codigo === codigo);
        if (index !== -1) {
            this.turmas.splice(index, 1);
        } else {
            throw new Error("Turma não encontrada.");
        }
    }

    public listarTurmas(): Turma[] {
        return this.turmas;
    }

    public contarTurmas(): number {
        return this.turmas.length;
    }

    public gerarRelatorio(): void {
        const totalAlunos = this.turmas.reduce((acc, turma) => acc + turma.contarAlunos(), 0);
        const alunosAcimaDaMedia = this.turmas.flatMap(turma => 
            turma.listarAlunos().filter(aluno => aluno.calcularMedia() >= 6)
        );
        const alunosAbaixoDaMedia = this.turmas.flatMap(turma => 
            turma.listarAlunos().filter(aluno => aluno.calcularMedia() < 6)
        );

        console.log(`Relatório da Escola: ${this.nome}`);
        console.log(`Total de turmas: ${this.contarTurmas()}`);
        console.log(`Total de alunos: ${totalAlunos}`);
        console.log(`Alunos acima da média: ${alunosAcimaDaMedia.length}`);
        console.log(`Alunos abaixo da média: ${alunosAbaixoDaMedia.length}`);
    }
}

// Criando a escola
const escola = new Escola("Escola Lógica Sempre");

const turma1 = new Turma(1, 10, "Turma de Matemática", "presencial");
const turma2 = new Turma(2, 10, "Turma de Português", "ead");

// Adicionando as turmas na escola
escola.adicionarTurma(turma1);
escola.adicionarTurma(turma2);

// Criando mais alunos
const aluno1 = new Aluno("Isaias", "Soares", "isa.soares@email.com", "presencial", 1, new Date(2005, 5, 15), [8, 9, 10]);
const aluno2 = new Aluno("Gabriela", "Silva", "gabriela.silva@email.com", "presencial", 1, new Date(2004, 9, 16), [7, 5, 10]);
const aluno3 = new Aluno("Jhon", "Oliveira", "jhon.oliveira@email.com", "ead", 2, new Date(2006, 2, 20), [9, 8, 10]);
const aluno4 = new Aluno("Guilherme", "Pereira", "guilherme.pereira@email.com", "ead", 2, new Date(2005, 7, 30), [6, 5, 7]);
const aluno5 = new Aluno("Lucas", "Almeida", "lucas.almeida@email.com", "presencial", 1, new Date(2005, 4, 12), [7, 8, 6]);

// Adicionando alunos às turmas
turma1.adicionarAluno(aluno1);
turma1.adicionarAluno(aluno2);
turma2.adicionarAluno(aluno3);
turma2.adicionarAluno(aluno4);
turma1.adicionarAluno(aluno5);

turma1.removerAluno("lucas.almeida@email.com");

turma1.atualizarAluno("gabriela.silva@email.com", { notas: [5, 4, 3] });

// Buscar aluno
console.log('Buscar aluno:')
const alunoBuscado = turma1.buscarAluno("gabriela.silva@email.com");
if (alunoBuscado) {
    console.log(`Nome: ${alunoBuscado.nome} ${alunoBuscado.sobrenome}`);
    console.log(`Email: ${alunoBuscado.email}`);
    console.log(`Notas: ${alunoBuscado.notas}`);
    console.log(`Média: ${alunoBuscado.calcularMedia()}`);
} else {
    console.log('Aluno não encontrado.');
}
console.log('----------------------------------------------------------------')

// Listar turmas
console.log('Listando as turmas:')
console.log(escola.listarTurmas());

console.log('Listando alunos da turma 1')
const alunosTurma1 = turma1.listarAlunos();
console.log(alunosTurma1);
console.log(turma1);
console.log(turma2);

console.log('Média')
console.log(`Média do ${aluno4.nome}: ${aluno4.calcularMedia()}`);

console.log(`Verificando situação do aluno ${aluno2.nome} e ${aluno4.nome}`)
console.log(aluno4.verificarSituacao());
console.log(aluno2.verificarSituacao());


// Desativando o aluno
console.log('Desativando o aluno')
aluno4.desativarAluno();
console.log(aluno4.ativo);
// Apresentando o aluno 4 desativado
console.log(JSON.stringify(aluno4));

// Ativando o aluno novamente
console.log('Ativando o aluno novamente')
aluno4.ativarAluno();
console.log(aluno4.ativo);
// Apresentando o aluno 4 ativo novamente
console.log(JSON.stringify(aluno4));

// Gerar relatório da escola
console.log('Gerando relatório:')
escola.gerarRelatorio();