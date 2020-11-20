/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const { RESTDataSource } = require('apollo-datasource-rest');

class ContentfulAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://cdn.contentful.com/spaces/${
      process.env.CONTENTFUL_SPACE_ID
    }`;
  }

  willSendRequest(request) {
    // request.params.set(
    //   'select',
    //   'sys.id,fields.title,fields.body,fields.createdAt,fields.tags,fields.author,fields.authorRole'
    // );
    request.headers.set(
      'Authorization',
      `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`
    );
  }

  async entry(id) {
    const data = await this.get(
      `/entries/${id}?select=sys.id,fields.title,fields.body,fields.createdAt,fields.tags,fields.author,fields.authorRole`
    );
    const entries = JSON.parse(data);
    return entries;
  }

  async entriesByContentType(content_type = 'fitness', limit = 10, skip = 0) {
    const data = await this.get(
      `/entries?content_type=${content_type}&limit=${limit}&skip=${skip}&select=sys.id,fields.title,fields.body,fields.createdAt,fields.tags,fields.author,fields.authorRole,fields.image`
    );
    const entries = JSON.parse(data);
    return entries;
  }

  async entries(limit = 10, skip = 0) {
    const data = await this.get(`/entries?limit=${limit}&skip=${skip}`);
    const entries = JSON.parse(data);
    return entries;
  }

  async singleAsset(id) {
    const data = await this.get(`/assets/${id}`);
    const entries = JSON.parse(data);
    return entries;
  }
}

module.exports = ContentfulAPI;
