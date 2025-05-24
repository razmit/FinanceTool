-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2025 at 06:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `transactions_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_account`
--

CREATE TABLE `bank_account` (
  `id_bank_account` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `balance` decimal(7,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `entries`
--

CREATE TABLE `entries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tipo` varchar(200) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` datetime NOT NULL,
  `factura_path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `entries`
--

INSERT INTO `entries` (`id`, `user_id`, `tipo`, `monto`, `fecha`, `factura_path`) VALUES
(4, 1, 'Salario', 1400.00, '2025-05-07 00:00:00', 'uploads\\factura-1747612665312.jpg'),
(5, 1, 'Venta', 15.33, '2025-05-22 00:00:00', 'uploads\\factura-1748016252353.jpg'),
(6, 1, 'Salario', 150.00, '2025-05-15 00:00:00', 'uploads\\factura-1748018438897.jpeg'),
(7, 1, 'Venta', 200.66, '2025-05-22 00:00:00', 'uploads\\factura-1748019103064.jpg'),
(8, 1, 'Venta', 600.00, '2025-04-28 00:00:00', 'uploads\\factura-1748020167212.jpg'),
(9, 1, 'Otro', 5.00, '2025-05-22 00:00:00', 'uploads\\factura-1748020227429.jpg'),
(10, 1, 'Otro', 1100.00, '2025-04-30 00:00:00', 'uploads\\factura-1748021162841.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`) VALUES
(1, 'pepe', '$2b$10$8X35P8Tpmkd34mSA8FMkhuRZHoRTnHvfRCDkP2Q4p4M9VsIVwXjfO'),
(2, 'pepe2', '$2a$10$GR.1ZM5x97Hrhf/nw70SsuxyS6cVZFnz8cAIXY1zE3yq.CmWXQkZm');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal`
--

CREATE TABLE `withdrawal` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` datetime NOT NULL,
  `factura_path` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `withdrawal`
--

INSERT INTO `withdrawal` (`id`, `user_id`, `tipo`, `monto`, `fecha`, `factura_path`) VALUES
(1, 1, 'Alquiler', 459.22, '2025-05-14 00:00:00', NULL),
(2, 1, 'Alquiler', 15.00, '2025-05-23 00:00:00', NULL),
(3, 1, 'Otro', 66.00, '2025-05-15 00:00:00', 'uploads\\salidas\\salida-1748016550968.jpg'),
(4, 1, 'Alquiler', 352.22, '2025-05-23 00:00:00', 'uploads\\salidas\\salida-1748018459640.jpg'),
(5, 1, 'Otro', 300.55, '2025-05-21 00:00:00', 'uploads\\salidas\\salida-1748019191575.jpg'),
(6, 1, 'Alquiler', 300.00, '2025-05-20 00:00:00', 'uploads\\salidas\\salida-1748020189905.jpg'),
(7, 1, 'Otro', 8.01, '2025-05-15 00:00:00', 'uploads\\salidas\\salida-1748020262674.jpg'),
(8, 1, 'Compras', 5.00, '2025-05-06 00:00:00', NULL),
(9, 1, 'Alquiler', 3.00, '2025-04-30 00:00:00', NULL),
(10, 1, 'Compras', 10.00, '2025-05-06 00:00:00', NULL),
(11, 1, 'Alquiler', 15.00, '2025-05-06 00:00:00', NULL),
(12, 1, 'Otro', 1000.00, '2025-05-27 00:00:00', NULL),
(13, 1, 'Compras', 50.00, '2025-05-13 00:00:00', NULL),
(14, 1, 'Otro', 16.00, '2025-05-16 00:00:00', NULL),
(15, 1, 'Compras', 16.00, '2025-05-13 00:00:00', NULL),
(16, 1, 'Compras', 15.00, '2025-05-21 00:00:00', NULL),
(17, 1, 'Alquiler', 14.99, '2025-05-22 00:00:00', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_account`
--
ALTER TABLE `bank_account`
  ADD PRIMARY KEY (`id_bank_account`),
  ADD KEY `fk_bank_account_user` (`id_user`);

--
-- Indexes for table `entries`
--
ALTER TABLE `entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_entry` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_withdrawal` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bank_account`
--
ALTER TABLE `bank_account`
  MODIFY `id_bank_account` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `entries`
--
ALTER TABLE `entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `withdrawal`
--
ALTER TABLE `withdrawal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bank_account`
--
ALTER TABLE `bank_account`
  ADD CONSTRAINT `fk_bank_account_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Constraints for table `entries`
--
ALTER TABLE `entries`
  ADD CONSTRAINT `fk_user_entry` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD CONSTRAINT `fk_user_withdrawal` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
