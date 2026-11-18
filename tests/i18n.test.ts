import { test } from 'node:test'
import assert from 'node:assert/strict'
import { t } from '../src/i18n.ts'

test('문구의 {이름} 자리에 값이 들어가고, 빈 자리는 남지 않는다', () => {
  assert.equal(t('pick_pair', { a: 1, b: 4 }).includes('1'), true)
  assert.equal(t('pick_pair', { a: 1, b: 4 }).includes('4'), true)
  assert.equal(t('mines_line', { n: 7 }).includes('7'), true)
  assert.equal(t('mines_line', { n: 7 }).includes('{'), false)
})

test('모든 키는 빈 문자열이 아니다', () => {
  for (const key of ['lines', 'score', 'game_over', 'restart', 'pause', 'resume', 'help_tetris', 'hint_long'] as const) {
    assert.ok(t(key).length > 0, key)
  }
})
