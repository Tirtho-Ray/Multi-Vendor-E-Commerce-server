/* eslint-disable prefer-const */
import { FilterQuery, Query } from "mongoose";

export class QueryBuilder<T> {
  public query: Record<string, unknown>;
  public modelQuery: Query<T[], T>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.query = query;
    this.modelQuery = modelQuery;
  }

  search(searchableFields: string[]) {
    const searchTerm =
      (this.query?.search as string) ||
      (this.query?.searchTerm as string) ||
      "";

    if (searchTerm) {
      const searchConditions = searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      }));

      this.modelQuery = this.modelQuery.find({
        $and: [
          // Keep previous filters intact
          { ...this.modelQuery.getQuery() },
          { $or: searchConditions },
        ],
      });
    }

    return this;
  }

  paginate() {
    const limit: number = Number(this.query?.limit || 10);
    let skip = 0;

    if (this.query?.page) {
      const page: number = Number(this.query?.page || 1);
      skip = (page - 1) * limit;
    }

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  sort() {
    const sortBy = (this.query?.sortBy as string) || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  fields() {
    if (this.query?.fields) {
      const fields = (this.query.fields as string).split(",").join(" ");
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["search", "searchTerm", "page", "limit", "sortBy", "fields"];
    excludeFields.forEach((e) => delete queryObj[e]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }
}
