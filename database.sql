
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "methods" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "drip_speed" VARCHAR(100),
  "lrr" DECIMAL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50) NOT NULL UNIQUE,
  "password" VARCHAR(50) NOT NULL UNIQUE,
  "profile_pic" VARCHAR(255),
  "methods_default_id" INT REFERENCES "methods",
  "kettle" VARCHAR(100),
  "grinder" VARCHAR(100),
  "tds_min" DECIMAL NOT NULL,
  "tds_max" DECIMAL NOT NULL,
  "ext_min" DECIMAL NOT NULL,
  "ext_max" DECIMAL NOT NULL
);

CREATE TABLE "users_methods" (
  "id" SERIAL PRIMARY KEY,
  "users_id" INT REFERENCES "users",
  "methods_id" INT REFERENCES "methods"
);

CREATE TABLE "flavors" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100)
);

CREATE TABLE "coffees" (
  "id" SERIAL PRIMARY KEY,
  "date" TIMESTAMP DEFAULT NOW() NOT NULL,
  "roaster" VARCHAR(255) NOT NULL,
  "roast_date" DATE,
  "is_blend" BOOLEAN DEFAULT false,
  "blend_name" VARCHAR(255),
  "country" VARCHAR(255),
  "producer" VARCHAR(255),
  "region" VARCHAR(255),
  "elevation" VARCHAR(100),
  "cultivars" VARCHAR(255),
  "processing" VARCHAR(100),
  "notes" TEXT
);

CREATE TABLE "coffees_flavors" (
  "id" SERIAL PRIMARY KEY,
  "coffees_id" INT REFERENCES "coffees",
  "flavors_id" INT REFERENCES "flavors"
);

CREATE TABLE "users_coffees" (
  "id" SERIAL PRIMARY KEY,
  "users_id" INT REFERENCES "users",
  "coffees_id" INT REFERENCES "coffees",
  "is_fav" BOOLEAN DEFAULT false
);

CREATE TABLE "brews" (
  "id" SERIAL PRIMARY KEY,
  "coffees_id" INT REFERENCES "coffees",
  "methods_id" INT REFERENCES "methods",
  "is_fav" BOOLEAN DEFAULT false,
  "date" TIMESTAMP DEFAULT NOW() NOT NULL,
  "water_dose" INT NOT NULL,
  "coffee_dose" INT NOT NULL,
  "grind" INT NOT NULL,
  "moisture" DECIMAL DEFAULT 1.5,
  "co2" DECIMAL DEFAULT 1,
  "ratio" DECIMAL NOT NULL,
  "tds" DECIMAL,
  "ext" DECIMAL
);