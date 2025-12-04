import { Module } from "@nestjs/common";
import { ForexController } from "./forex.controller";
import { ForexGateway } from "./forex.gateway";

@Module({
  controllers: [ForexController],
  providers: [ForexGateway],
})
export class ForexModule {}

