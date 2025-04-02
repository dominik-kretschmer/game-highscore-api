<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241220082307 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
        CREATE TABLE player (
            id INT AUTO_INCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            PRIMARY KEY(id)
        )
    ');

        $this->addSql('
        CREATE TABLE score (
            id INT AUTO_INCREMENT NOT NULL, 
            player_id INT NOT NULL,
            score INT NOT NULL, 
            FOREIGN KEY (player_id) 
                REFERENCES player (id),
            PRIMARY KEY(id)
        )
    ');

        $this->addSql('
        CREATE TABLE `user` (
            id INT AUTO_INCREMENT NOT NULL,
            email VARCHAR(255) NOT NULL, 
            password VARCHAR(255) NOT NULL,
            roles JSON NOT NULL,
            PRIMARY KEY(id)
        )
    ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE score');
        $this->addSql('DROP TABLE player');
        $this->addSql('DROP TABLE `user`');
    }
}
