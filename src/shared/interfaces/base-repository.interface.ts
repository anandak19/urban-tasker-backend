import { ClientSession, InferRawDocType, UpdateQuery } from 'mongoose';
import { FilterQuery } from 'mongoose';
import { PaginatedResult } from './query.interface';
import { IFindAllOptions } from './repository.interface';
import { TObjectId } from '@shared/types/db-types';

export interface IBaseRepository<TDocument, TCreate> {
  /**
   * To find all documents
   * @param {IFindAllOptions} options? - contains- page, limit, sort, select
   * options can contain all the properties in IFindAllOptions interface and are OPTIONAL
   * Default values of page and limit are provided if not provided manually --check base repo class to find values
   *
   * @param {FilterQuery<InferRawDocType<TDocument>>} filter? actual mongoose filter query
   * it contains properties and values of object and other agregation operations
   * ex: { userRole: {$ne: 'admin'}, isActive: true }
   * No need to give {isDeleted: false}. The repo will add it later
   * But if provided {isDeleted: true}. Repo will use this insted and get deleted docs
   *
   * @returns {Promise<PaginatedResult<TDocument>>} object that contains array of docs and metaData
   * metaData contains: total(total docs), page(current page), limit and pages(total pages)
   */
  findAll(
    options?: IFindAllOptions,
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
    id: string | TObjectId,
    update: UpdateQuery<InferRawDocType<TDocument>>,
    session?: ClientSession,
  ): Promise<TDocument | null>;

  updateMany(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<boolean>;

  /**
   * Delete one document by id
   * @param {string} id - id of document to update
   * @returns {Promise<TDocument | null>} - deleted document / null if no match
   */
  deleteOneById(id: string): Promise<TDocument | null>;

  /**
   * Find all the docs with given condition
   * @param {FilterQuery<InferRawDocType<TDocument>>} filter
   */
  find(
    filter: FilterQuery<InferRawDocType<TDocument>>,
  ): Promise<TDocument[] | null>;
}
