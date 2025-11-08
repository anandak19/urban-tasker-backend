import { InferRawDocType, UpdateQuery } from 'mongoose';
import { FilterQuery } from 'mongoose';
import { IPaginationQuery, PaginatedResult } from './query.interface';

export interface IBaseRepository<TDocument, TCreate> {
  /**
   * To find all documents
   * @param {IPaginationQuery} paginationDto? - contains: page, limit
   * @param {FilterQuery<InferRawDocType<TDocument>>} paginationDto? actual mongoose filter query and its TDoc object
   * @returns {Promise<PaginatedResult<TDocument>>} object that contains array of docs and metaData
   */
  findAll(
    paginationDto?: IPaginationQuery,
    filter?: FilterQuery<InferRawDocType<TDocument>>,
  ): Promise<PaginatedResult<TDocument>>;

  /**
   * To find a document by its id
   * @param {string} id - id of docuemnt
   * @returns {Promise<TDocument | null>} - if doc is found return doc
   * else return null
   */
  findById(id: string): Promise<TDocument | null>;

  /**
   * To find first document satisfying the condition
   * @param filter - filter object that contains property and value in a doc
   * @returns {Promise<TDocument | null>} - returns doc if found,
   * else return null
   */
  findOne(
    filter: FilterQuery<InferRawDocType<TDocument>>,
  ): Promise<TDocument | null>;

  /**
   * To create and add new document to collection
   * @param data - object containing data for new docuemnt
   * @returns {Promise<TDocument>} - returns new saved/created document
   */
  create(data: TCreate): Promise<TDocument>;

  /**
   * To update a document by its id
   * @param {string} id - id of document
   * @param update - object containing update properties and values
   * @returns {Promise<TDocument | null>} - updated document, if no update - null
   */
  updateById(
    id: string,
    update: UpdateQuery<InferRawDocType<TDocument>>,
  ): Promise<TDocument | null>;

  /**
   * Delete one document by id
   * @param {string} id - id of document to update
   * @returns {Promise<TDocument | null>} - deleted document / null if no match
   */
  deleteOneById(id: string): Promise<TDocument | null>;
}
