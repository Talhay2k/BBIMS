import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`\n======================================================`);
    console.log(
        `🩸 NestJS Node.js Backend Server running on port http://localhost:${port}`,
    );
    console.log(`   API Endpoint Base: http://localhost:${port}/api`);
    console.log(`======================================================\n`);
}

void bootstrap();
