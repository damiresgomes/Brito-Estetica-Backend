-- Adiciona autenticação separada dos registros de clientes e administradores.
-- Não remove nem recria dados existentes.
CREATE TABLE IF NOT EXISTS `contas_acesso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `papel` enum('cliente','admin') NOT NULL,
  `ativo` enum('Sim','Não') NOT NULL DEFAULT 'Sim',
  `cliente_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_contas_acesso_email` (`email`),
  UNIQUE KEY `uq_contas_acesso_cliente` (`cliente_id`),
  UNIQUE KEY `uq_contas_acesso_usuario` (`usuario_id`),
  CONSTRAINT `fk_contas_acesso_cliente`
    FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `fk_contas_acesso_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `chk_contas_acesso_vinculo` CHECK (
    (`papel` = 'cliente' AND `cliente_id` IS NOT NULL AND `usuario_id` IS NULL)
    OR
    (`papel` = 'admin' AND `cliente_id` IS NULL AND `usuario_id` IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A tabela usuario não tinha papel. Seus registros eram as contas usadas pelo
-- login administrativo anterior; preserve os hashes e habilite esses acessos.
-- IGNORE torna o backfill repetível e não sobrescreve contas preexistentes.
INSERT IGNORE INTO `contas_acesso`
  (`email`, `senha_hash`, `papel`, `ativo`, `usuario_id`)
SELECT `email`, `senha`, 'admin', `ativo`, `id`
  FROM `usuario`;
