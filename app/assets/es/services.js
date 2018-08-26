'use strict';

import { Utils } from "./utils";

const URL = '/api/posts.json';

export class PostsService {
    init() {
        console.log('Init: ' + URL);
    }

    getPosts() {
        return Utils.getJSONByPromise(this.URL);
    }
}