-- CreateTable
CREATE TABLE `Func_Med` (
    `id` INTEGER NOT NULL,
    `pacienteId` INTEGER NOT NULL,
    `medicoId` INTEGER NOT NULL,
    `nome_pac` VARCHAR(100) NOT NULL,
    `nome_med` VARCHAR(100) NOT NULL,
    `crm_med` VARCHAR(100) NOT NULL,
    `cpf_pac` VARCHAR(11) NOT NULL,
    `data` DATE NOT NULL,
    `afast_o` DATE NOT NULL,
    `afast_c` DATE NOT NULL,
    `motivo` VARCHAR(100) NOT NULL,
    `ass_med` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Func_Med` ADD CONSTRAINT `Func_Med_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Func_Med` ADD CONSTRAINT `Func_Med_medicoId_fkey` FOREIGN KEY (`medicoId`) REFERENCES `Medico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
