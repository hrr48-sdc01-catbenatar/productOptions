-- DROP DATABASE IF EXISTS options;

-- CREATE DATABASE options
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE = 'en_US.UTF-8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- \c options;

-- CREATE TABLE public."Products"
-- (
--     id integer NOT NULL DEFAULT nextval('"Products_id_seq"'::regclass),
--     name character varying(255) COLLATE pg_catalog."default" NOT NULL,
--     price double precision NOT NULL,
--     reviews double precision DEFAULT '0'::double precision,
--     "reviewCount" integer DEFAULT 0,
--     CONSTRAINT "Products_pkey" PRIMARY KEY (id)
-- )

-- TABLESPACE pg_default;

-- ALTER TABLE public."Products"
--     OWNER to postgres;



-- CREATE TABLE public."Stocks"
-- (
--     id integer NOT NULL DEFAULT nextval('"Stocks_id_seq"'::regclass),
--     color character varying(255) COLLATE pg_catalog."default",
--     "colorUrl" character varying(255) COLLATE pg_catalog."default",
--     size character varying(255) COLLATE pg_catalog."default",
--     qty integer DEFAULT 0,
--     "ProductId" integer,
--     "StoreId" integer,
--     CONSTRAINT "Stocks_pkey" PRIMARY KEY (id),
--     CONSTRAINT "Stocks_ProductId_fkey" FOREIGN KEY ("ProductId")
--         REFERENCES public."Products" (id) MATCH SIMPLE
--         ON UPDATE CASCADE
--         ON DELETE SET NULL,
--     CONSTRAINT "Stocks_StoreId_fkey" FOREIGN KEY ("StoreId")
--         REFERENCES public."Stores" (id) MATCH SIMPLE
--         ON UPDATE CASCADE
--         ON DELETE SET NULL
-- )

-- TABLESPACE pg_default;

-- ALTER TABLE public."Stocks"
--     OWNER to postgres;


-- CREATE TABLE public."Stores"
-- (
--     id integer NOT NULL DEFAULT nextval('"Stores_id_seq"'::regclass),
--     location character varying(255) COLLATE pg_catalog."default" NOT NULL,
--     CONSTRAINT "Stores_pkey" PRIMARY KEY (id)
-- )

-- TABLESPACE pg_default;

-- ALTER TABLE public."Stores"
--     OWNER to postgres;

-- CREATE TABLE public."Stores"
-- (
--     id integer NOT NULL DEFAULT nextval('"Stores_id_seq"'::regclass),
--     location character varying(255) COLLATE pg_catalog."default" NOT NULL,
--     CONSTRAINT "Stores_pkey" PRIMARY KEY (id)
-- )

TRUNCATE "Stocks" CASCADE;
TRUNCATE "Products" CASCADE;
TRUNCATE "Stores" CASCADE;

\copy "Stores" FROM '/Users/madison/Documents/Hack Reactor/hrr48-sdc/productOptions/server/stores.csv' WITH CSV HEADER;
\copy "Products" FROM '/Users/madison/Documents/Hack Reactor/hrr48-sdc/productOptions/server/products.csv' WITH CSV HEADER;
\copy "Stocks" FROM '/Users/madison/Documents/Hack Reactor/hrr48-sdc/productOptions/server/stocks.csv' WITH CSV HEADER;

-- SELECT * FROM "Stocks";
-- EXPLAIN ANALYZE SELECT * FROM "Products";
-- SELECT * FROM "Stores";

-- ** EXPLAIN ANALYZE OR \timing CAN BE USED FOR TIMING QUERIES.