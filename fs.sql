-- MySQL dump 10.13  Distrib 5.7.12, for osx10.11 (x86_64)
--
-- Host: localhost    Database: fs
-- ------------------------------------------------------
-- Server version	5.7.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fs_version`
--

DROP TABLE IF EXISTS `fs_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fs_version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repository` varchar(100) NOT NULL,
  `deployment` varchar(45) NOT NULL DEFAULT 'production' COMMENT 'dev\nalpha\nmaster\nproduction',
  `platform` varchar(45) NOT NULL,
  `branch` varchar(45) NOT NULL DEFAULT 'master',
  `version` varchar(45) NOT NULL,
  `author` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `desc` varchar(100) NOT NULL DEFAULT '{}',
  PRIMARY KEY (`id`),
  KEY `idx_fs_version_deployment_platform_branch` (`deployment`,`platform`,`branch`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fs_version`
--

LOCK TABLES `fs_version` WRITE;
/*!40000 ALTER TABLE `fs_version` DISABLE KEYS */;
INSERT INTO `fs_version` VALUES (1,'git@git.corp.angejia.com:service/angejia.git','production','app-crm','master','',0,'2016-06-20 16:55:32','2016-06-20 17:03:28',0,''),(2,'git@git.corp.angejia.com:service/angejia.git','production','app-site','master','',0,'2016-06-20 16:57:49','2016-06-20 17:03:28',1,''),(3,'git@git.corp.angejia.com:service/angejia.git','production','app-platform','master','',0,'2016-06-20 16:58:49','2016-06-20 17:03:28',1,''),(4,'git@git.corp.angejia.com:service/angejia.git','production','app-bureau','master','',0,'2016-06-20 17:27:15','2016-06-20 17:27:15',0,''),(5,'git@git.corp.angejia.com:service/angejia.git','production','app-site','master','',0,'2016-06-20 18:03:06','2016-06-20 18:25:45',1,''),(6,'git@git.corp.angejia.com:service/angejia.git','production','app-site','master','',0,'2016-06-20 18:27:29','2016-06-20 18:27:29',0,''),(7,'git@git.corp.angejia.com:service/angejia.git','production','app-bureau','master','',0,'2016-06-20 18:32:01','2016-06-22 11:37:13',1,'');
/*!40000 ALTER TABLE `fs_version` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-24 15:15:50
