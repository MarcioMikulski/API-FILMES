import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FilmeEntityMock } from '../__mocks__/filme.mock';
import { createFilmeMock } from '../__mocks__/create-filme.mock';
import { FilmesService } from '../Filmes.service';
import { CreateFilmeDto } from '../dto/create-filme.dto';

import { CacheService } from '../../cache/cache.service';
import { Filme } from '../entities/filme.entity';
import { responseFilmeMock } from '../__mocks__/reponseFilme.mock';

describe('FilmesService', () => {
  let service: FilmesService;
  let filmeRepository: Repository<Filme>;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmesService,
        {
          provide: getRepositoryToken(Filme),
          useValue: {
            findOne: jest.fn().mockResolvedValue(FilmeEntityMock),
            save: jest.fn().mockResolvedValue(FilmeEntityMock),
            findaAll: jest.fn().mockResolvedValue([FilmeEntityMock]),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue(null),
            setCache: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<FilmesService>(FilmesService);
    filmeRepository = module.get<Repository<Filme>>(getRepositoryToken(Filme));
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(filmeRepository).toBeDefined();
  });

  it('should return the correct film', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(responseFilmeMock);
  });

  it('should throw an error when film is not found', async () => {
    jest.spyOn(filmeRepository, 'findOne').mockResolvedValue(undefined);
    await expect(service.findOne(1)).rejects.toThrowError();
  });

  it('should return the correct film by title', async () => {
    const result = await service.findByTitle(responseFilmeMock.titulo);
    expect(result).toEqual(responseFilmeMock);
  });

  it('should throw an error when film by title is not found', async () => {
    jest.spyOn(filmeRepository, 'findOne').mockResolvedValue(undefined);
    await expect(
      service.findByTitle(responseFilmeMock.titulo),
    ).rejects.toThrowError();
  });

  it('should return false if title is not taken', async () => {
    jest.spyOn(filmeRepository, 'findOne').mockResolvedValue(undefined);
    const filme = await service.isTituloTaken('new title');
    expect(filme).toBe(false);
  });

  it('should return true if title is taken', async () => {
    jest.spyOn(filmeRepository, 'findOne').mockResolvedValue(FilmeEntityMock);
    const filme = await service.isTituloTaken('new title');
    expect(filme).toBe(true);
  });
});
