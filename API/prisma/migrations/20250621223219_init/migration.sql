-- CreateTable
CREATE TABLE `Paciente` (
    `id` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(50) NOT NULL,
    `cpf` VARCHAR(11) NULL,
    `telefone` VARCHAR(15) NULL,
    `data_nascimento` DATE NULL,
    `endereco` VARCHAR(200) NULL,

    UNIQUE INDEX `Paciente_email_key`(`email`),
    UNIQUE INDEX `Paciente_senha_key`(`senha`),
    UNIQUE INDEX `Paciente_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enfermeira` (
    `id` INTEGER NOT NULL,
    `ecip` VARCHAR(100) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `area` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `cpf` VARCHAR(11) NULL,
    `telefone` VARCHAR(15) NULL,
    `data_nascimento` DATE NULL,
    `endereco` VARCHAR(200) NULL,

    UNIQUE INDEX `Enfermeira_ecip_key`(`ecip`),
    UNIQUE INDEX `Enfermeira_email_key`(`email`),
    UNIQUE INDEX `Enfermeira_senha_key`(`senha`),
    UNIQUE INDEX `Enfermeira_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medico` (
    `id` INTEGER NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `crm` VARCHAR(100) NOT NULL,
    `especialidade` VARCHAR(100) NULL,
    `cpf` VARCHAR(11) NULL,
    `telefone` VARCHAR(15) NULL,
    `data_nascimento` DATE NULL,
    `endereco` VARCHAR(200) NULL,

    UNIQUE INDEX `Medico_email_key`(`email`),
    UNIQUE INDEX `Medico_senha_key`(`senha`),
    UNIQUE INDEX `Medico_crm_key`(`crm`),
    UNIQUE INDEX `Medico_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
