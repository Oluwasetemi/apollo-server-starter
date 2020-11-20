/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const { RESTDataSource } = require('apollo-datasource-rest');

class WgerdotdeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://wger.de/api/v2`;
  }

  willSendRequest(request) {
    // request.headers.set(
    //   'Authorization',
    //   `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`
    // );
    // request.params.set('format', 'json');
    // request.params.set('language', '2');
    // request.params.set('status', 2);
  }

  async test() {
    try {
      const data = await this.get(`/`);
      // const allApi = JSON.parse(data);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async exerciseList(limit = 10, skip = 0) {
    const data = await this.get(
      `/exercise?format=json&limit=${limit}&offset=${skip}&language=2&status=2`
    );
    return data;
  }

  async exerciseImageList(limit = 10, skip = 0) {
    const data = await this.get(
      `/exerciseimage/?format=json&limit=${limit}&offset=${skip}&language=2&status=2`
    );
    return data;
  }

  async exerciseInfo(limit = 10, skip = 0) {
    const data = await this.get(
      `/exerciseinfo/?format=json&limit=${limit}&offset=${skip}&language=2&status=2`
    );
    return data;
  }

  async exerciseImage(id) {
    const data = await this.get(
      `/exerciseimage/${id}?format=json&language=2&status=2`
    );
    return data;
  }

  async exercise(id) {
    const data = await this.get(
      `/exercise/${id}?format=json&language=2&status=2`
    );
    return data;
  }

  async exerciseCategory(id) {
    const data = await this.get(
      `/exercisecategory/${id}?format=json&language=2&status=2`
    );
    return data;
  }
}

module.exports = WgerdotdeAPI;
