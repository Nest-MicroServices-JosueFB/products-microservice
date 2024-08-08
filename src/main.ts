import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

    const logger = new Logger('Main')


  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // transport: Transport.TCP,
      transport: Transport.NATS,
      options: {
        // host: '0.0.0.0',
        // ?If docker container, name of container
        // host: products,
        // port: envs.port
        servers: envs.natsServers
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // app.startAllMicroservices()
  await app.listen();
  // logger.log(`App running on port ${envs.port}`);
  logger.log(`Products Microservice running on port ${envs.port}`);

}
bootstrap();
