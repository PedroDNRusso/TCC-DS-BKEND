-- CreateTable
CREATE TABLE `Mens_Med` (
    `id` INTEGER NOT NULL,
    `pacienteId` INTEGER NOT NULL,
    `medicoId` INTEGER NOT NULL,
    `nome_pac` VARCHAR(100) NOT NULL,
    `mensagem` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mens_Med` ADD CONSTRAINT `Mens_Med_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mens_Med` ADD CONSTRAINT `Mens_Med_medicoId_fkey` FOREIGN KEY (`medicoId`) REFERENCES `Medico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
