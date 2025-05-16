import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "fetchTokenList",
      "addList",
      "removeList",
      "enableList",
      "disableList",
      "acceptListUpdate",
      "rejectVersionUpdate",
      "updateListVersion",
      "getTokenList",
      "createListsAtom",
      "NEW_LIST_STATE",
      "createTokenListReducer",
      "useFetchListCallback",
    ]
  `)
})
