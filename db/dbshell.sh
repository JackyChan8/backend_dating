#!/bin/bash
set -e
export PGPASSWORD=postgres;
psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE postgres TO "postgres";
    
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY NOT NULL,
        uid VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        confirm_email BOOLEAN NOT NULL DEFAULT 'f',
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens(
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS dialogs(
        id SERIAL PRIMARY KEY NOT NULL,
        author_id INTEGER NOT NULL,
        partner_id INTEGER NOT NULL,
        last_message TEXT NOT NULL,
        FOREIGN KEY (author_id) REFERENCES users(id),
        FOREIGN KEY (partner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages(
        id SERIAL PRIMARY KEY NOT NULL,
        dialog_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY (dialog_id) REFERENCES dialogs(id),
        FOREIGN KEY (author_id) REFERENCES users(id)
    );
EOSQL