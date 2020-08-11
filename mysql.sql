CREATE TABLE `bank_tx` (
  `id` int NOT NULL AUTO_INCREMENT,
  `remark` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `tx_hash` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

