import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Filme } from './entities/filme.entity';
import { Repository, getRepository, ILike } from 'typeorm';
import { Encrypt } from '../auth/encrypt';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { ResponseFilmeDto } from './dto/response-filme.dto';

import { CacheService } from '../cache/cache.service';
import { error } from 'console';

@Injectable()
export class FilmesService {
  constructor(
    @InjectRepository(Filme)
    private filmeRepository: Repository<Filme>,
    private readonly cacheService: CacheService,
  ) {}

  private convertToDTO(filme: Filme): ResponseFilmeDto {
    return {
      id: filme.id,
      titulo: filme.titulo,
      ano: filme.ano,
      genero: filme.genero,
    };
  }

  async getAll(): Promise<ResponseFilmeDto[]> {
    const cachedFilmes = await this.cacheService.getCache('filmes', async () =>
      this.filmeRepository.find(),
    );

    if (cachedFilmes) {
      return cachedFilmes;
    } else {
      const filmes = await this.filmeRepository.find();
      const filmesDTO = filmes.map((filme) => this.convertToDTO(filme));
      await this.cacheService.setCache('filmes', async () => filmesDTO);

      return filmesDTO;
    }
  }

  async findOne(id: number): Promise<ResponseFilmeDto> {
    const filme = await this.filmeRepository.findOne({
      where: { id },
    });

    if (!filme) {
      throw new Error('Usuário não encontrado');
    }
    return this.convertToDTO(filme);
  }

  async findByTitle(titulo: string): Promise<Filme> {
    const filme = await this.filmeRepository.findOne({ where: { titulo } });
    if (!filme) {
      throw new NotFoundException('Filme não encontrado');
    }
    return filme;
  }

  async isTituloTaken(titulo: string): Promise<boolean> {
    const filme = await this.filmeRepository.findOne({ where: { titulo } });
    return !!filme;
  }
  
 
 emptyTitulo(titulo: string): boolean {
    if (!titulo || titulo.trim() === '') {
      return true;
    } else {
      return false;
    }
  }

  async emptyBody(body: CreateFilmeDto): Promise<boolean> {
    return !body || !body.titulo || !body.ano || !body.genero;
  }

  async create(filme: Filme): Promise<void> {
    // Lógica para adicionar o novo filme ao banco de dados
    await this.filmeRepository.save(filme);

    // Atualizar o cache associado à lista de filmes
    const filmes = await this.filmeRepository.find();
    const filmesDTO = filmes.map((filme) => this.convertToDTO(filme));
    await this.cacheService.setCache('filmes', filmesDTO);
  }

  async deletar(id: number) {
    const filme = this.filmeRepository.findOneBy({ id: id });
    if (!filme) {
      throw new Error('filme não encontrado');
    }
    await this.filmeRepository.delete(id);
    const filmes = await this.filmeRepository.find();
    const filmesDTO = filmes.map((filme) => this.convertToDTO(filme));
    await this.cacheService.setCache('filmes', filmesDTO);
    return 'filme deletado com sucesso';
  }

  async patch(id: number, filme: CreateFilmeDto): Promise<string> {
    const filmeToUpdate = await this.filmeRepository.findOne({
      where: { id },
    });
    if (!filmeToUpdate) {
      throw new NotFoundException('Filme não encontrado');
    }
    await this.filmeRepository.update(id, filme);
    const filmes = await this.filmeRepository.find();
    const filmesDTO = filmes.map((filme) => this.convertToDTO(filme));
    await this.cacheService.setCache('filmes', filmesDTO);
    return 'filme atualizado com sucesso';
  }
}
