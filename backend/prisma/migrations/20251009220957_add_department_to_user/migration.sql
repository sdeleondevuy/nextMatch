-- CreateEnum
CREATE TYPE "public"."Department" AS ENUM ('Montevideo', 'Artigas', 'Canelones', 'CerroLargo', 'Colonia', 'Durazno', 'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Paysandu', 'RioNegro', 'Rivera', 'Rocha', 'Salto', 'SanJose', 'Soriano', 'Tacuarembo', 'TreintaYTres');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "department" "public"."Department" NOT NULL DEFAULT 'Montevideo';
