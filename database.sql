-- First, create a database called "pacamara"
-- Then, execute these queries:

CREATE TABLE "methods" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "drip_speed" VARCHAR(100),
  "lrr" DECIMAL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL UNIQUE,
  "profile_pic" VARCHAR(255),
  "methods_default_id" INT REFERENCES "methods",
  "kettle" VARCHAR(100),
  "grinder" VARCHAR(100),
  "tds_min" DECIMAL,
  "tds_max" DECIMAL,
  "ext_min" DECIMAL,
  "ext_max" DECIMAL
);

CREATE TABLE "users_methods" (
  "id" SERIAL PRIMARY KEY,
  "users_id" INT REFERENCES "users" ON DELETE CASCADE,
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
  "coffees_id" INT REFERENCES "coffees" ON DELETE CASCADE,
  "flavors_id" INT REFERENCES "flavors"
);

CREATE TABLE "users_coffees" (
  "id" SERIAL PRIMARY KEY,
  "users_id" INT REFERENCES "users" ON DELETE CASCADE,
  "coffees_id" INT REFERENCES "coffees",
  "is_fav" BOOLEAN DEFAULT false
);

CREATE TABLE "brews" (
  "id" SERIAL PRIMARY KEY,
  "coffees_id" INT REFERENCES "coffees" ON DELETE CASCADE,
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


INSERT INTO "methods" ("name", "drip_speed", "lrr")
VALUES ('Chemex', 'Slow',	2.1), 
('Automatic Brewer', 'Medium	', 2.1),
('Hario v60',	'Fast',	2.1),
('December Dripper',	'Medium',	2.1),
('French Press', NULL, 2.5),
('Kalita Wave 185',	'Medium', 2.1),
('Aeropress', NULL, 2.1),
('Origami Dripper',	'Medium',	2.1);

INSERT INTO "flavors" ("name")
VALUES ('Chocolate'), ('Fruity'), ('Floral'), ('Light'), ('Bright'), ('Full');