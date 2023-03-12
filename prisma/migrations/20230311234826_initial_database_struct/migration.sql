-- CreateTable
CREATE TABLE "places" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "place_id" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL,
    CONSTRAINT "games_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "games_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "games_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "places_name_idx" ON "places"("name");

-- CreateIndex
CREATE INDEX "teams_name_idx" ON "teams"("name");
