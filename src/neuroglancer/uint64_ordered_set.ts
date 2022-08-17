/**
 * @license
 * Copyright 2016 Google Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {WatchableValueInterface} from 'neuroglancer/trackable_value';
import {Uint64} from 'neuroglancer/util/uint64';
import {registerRPC, registerSharedObject, RPC} from 'neuroglancer/worker_rpc';
import {Uint64Set} from 'neuroglancer/uint64_set';

@registerSharedObject('Uint64OrderedSet')
export class Uint64OrderedSet extends Uint64Set implements
    WatchableValueInterface<Uint64OrderedSet> {
  _array: Uint64[] = [];

  get value() {
    return this;
  }

  static makeWithCounterpart(rpc: RPC) {
    let obj = new Uint64OrderedSet();
    obj.initializeCounterpart(rpc);
    return obj;
  }

  add_(x: Uint64[]) {
    let changed = false;
    for (const v of x) {
      if (this.hashTable.add(v)) {
        this._array.push(v.clone());
        changed = true;
      }
    }
    return changed;
  }

  add(x: Uint64|Uint64[], sendRPC = true) {
    const tmp = Array<Uint64>().concat(x);
    if (this.add_(tmp)) {
      let {rpc} = this;
      if (rpc && sendRPC) {
        rpc.invoke('Uint64OrderedSet.add', {'id': this.rpcId, 'value': tmp});
      }
      this.changed.dispatch(x, true);
    }
  }

  [Symbol.iterator]() {
    return this._array.values();
  }

  delete_(x: Uint64[]) {
    let changed = false;
    for (const v of x) {
      if (this.hashTable.delete(v)) {
        this._array = this._array.filter(y =>!Uint64.equal(y, v));
        changed = true;
      }
    }
    return changed;
  }

  delete(x: Uint64|Uint64[], sendRPC = true) {
    const tmp = Array<Uint64>().concat(x);
    if (this.delete_(Array<Uint64>().concat(x))) {
      let {rpc} = this;
      if (rpc && sendRPC) {
        rpc.invoke('Uint64OrderedSet.delete', {'id': this.rpcId, 'value': tmp});
      }
      this.changed.dispatch(x, false);
    }
  }

  clear(sendRPC = true) {
    if (this.hashTable.clear()) {
      this._array = [];
      let {rpc} = this;
      if (rpc && sendRPC) {
        rpc.invoke('Uint64OrderedSet.clear', {'id': this.rpcId});
      }
      this.changed.dispatch(null, false);
    }
  }

  toJSON() {
    let result = new Array<string>();
    for (let id of this) {
      result.push(id.toString());
    }
    return result;
  }

  assignFrom(other: Uint64OrderedSet) {
    this.clear();
    for (const key of other) {
      this.add(key);
    }
  }
}

registerRPC('Uint64OrderedSet.add', function(x) {
  let obj = this.get(x['id']);
  let values = x['value'].map((el: any) => new Uint64(el.low, el.high));
  obj.add(values, false);
});

registerRPC('Uint64OrderedSet.delete', function(x) {
  let obj = this.get(x['id']);
  let values = x['value'].map((el: any) => new Uint64(el.low, el.high));
  obj.delete(values, false);
});

registerRPC('Uint64OrderedSet.clear', function(x) {
  let obj = this.get(x['id']);
  obj.clear(false);
});
