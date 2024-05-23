import {
  ConflictException,
  Body,
  Post,
  Get,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Put, UseInterceptors } from '@nestjs/common/decorators';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { Controller } from '@nestjs/common';
import { FilmesService } from './filmes.service';
import { UsersService } from '../users/users.service';

import { ResponseFilmeDto } from './dto/response-filme.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';

import { UserType } from '../users/enum/user-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { Filme } from './entities/filme.entity';

@Controller('filmes')
@UseInterceptors(CacheInterceptor)
export class FilmesController {
  constructor(private filmeservice: FilmesService) {}

  @Roles(UserType.User)
  @Get()
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Buscar todos os filmes cadastrados',
    description: 'Endpoint para buscar todos os filmes',
  })
  @ApiResponse({
    status: 200,
    description: 'Filme encontrado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum filme corresponde à pesquisa feita.',
  })
  @ApiResponse({
    status: 403,
    description: 'Você não tem permissão para acessar este recurso.',
  })
  @Roles(UserType.User)
  async getFilmes(): Promise<ResponseFilmeDto[]> {
    return this.filmeservice.getAll();
  }

  @Roles(UserType.User)
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar um filme pelo seu ID',
    description: 'Endpoint para buscar um filme pelo seu ID',
  })
  @UsePipes(ValidationPipe)
  @ApiResponse({
    status: 200,
    description: 'Filme encontrado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
  @ApiResponse({
    status: 403,
    description: 'Você não tem permissão para acessar este recurso.',
  })
  async getFilme(@Param('id') id: number): Promise<ResponseFilmeDto> {
    return this.filmeservice.findOne(id);
  }
  @Roles(UserType.User)
  @Post()
  @ApiOperation({
    summary: 'Cadastrar um novo filme',
    description: 'Endpont para cadastramento de um filme',
  })
  @ApiResponse({
    status: 201,
    description: 'Cadastro efetuado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitação inválida.',
  })
  @ApiResponse({
    status: 409,
    description: 'Filme já cadastrado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Você não tem permissão para acessar este recurso.',
  })
  async createFilme(@Body() createFilmeDto: CreateFilmeDto) {
    const filme = this.convertToFilme(createFilmeDto);
    await this.filmeservice.create(filme);
  }

  private convertToFilme(createFilmeDto: CreateFilmeDto): Filme {
    const filme = new Filme();
    filme.titulo = createFilmeDto.titulo;
    filme.ano = createFilmeDto.ano;
    filme.genero = createFilmeDto.genero;

    return filme;
  }

  @Roles(UserType.User)
  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar um filme pelo seu ID',
    description: 'Endpoint para deletar um filme',
  })
  @ApiResponse({ status: 200, description: 'Filme deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
  @ApiResponse({
    status: 403,
    description: 'Você não tem permissão para acessar este recurso.',
  })
  async deleteFilme(@Param('id') id: number) {
    await this.filmeservice.deletar(id);
    return 'filme deletado com sucesso';
  }

  @Roles(UserType.User)
  @Put(':id')
  @ApiResponse({ status: 200, description: 'Filme editado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
  @ApiResponse({
    status: 403,
    description: 'Você não tem permissão para acessar este recurso.',
  })
  async editFilme(
    @Param('id') id: number,
    @Body() filme: CreateFilmeDto,
  ): Promise<string> {
    return await this.filmeservice.patch(id, filme);
  }
}
