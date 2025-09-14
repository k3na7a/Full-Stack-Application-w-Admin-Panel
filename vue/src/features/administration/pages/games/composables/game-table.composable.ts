import { useI18n } from 'vue-i18n'
import { LocationQuery, useRoute } from 'vue-router'
import { computed, reactive, ref, watch } from 'vue'

import { parseQuery } from '@lib/utilities/parse-query.util'
import { GameDto } from '@lib/dto/game.dto'
import { PaginationOptions, Order, PaginationMeta, PaginationDto } from '@lib/dto/pagination.dto'
import { useGameAdminHandler } from '../handlers/games.handler'
import { columns } from '@/shared/components/table/composables/paginated-table.composable'

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'game.release_date',
  search: undefined
}

const tableColumns: columns = [
  { name: 'game', label: 'administration.games-and-software.games.item', sort: 'game.name' },
  { name: 'platforms', label: 'administration.games-and-software.platforms.label' },
  { name: 'release', label: 'forms.release-date', sort: 'game.release_date' },
  { name: 'actions' }
]

function useGamesTable() {
  const { t } = useI18n()
  const $route = useRoute()

  const { create, update, remove, getPaginated } = useGameAdminHandler(t)

  const loading = ref<boolean>(false)
  const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))

  const response = reactive<{ data: Array<GameDto>; meta: PaginationMeta }>({
    data: [],
    meta: new PaginationMeta({ pageOptions: defaultOptions, itemCount: 0 })
  })

  function createGame(): void {
    create((_: GameDto) => getPaginatedData(options.value))
  }

  function removeGame(game: GameDto): void {
    remove(game, (_: GameDto) => getPaginatedData(options.value))
  }

  function updateGame(game: GameDto): void {
    update(game, (_: GameDto) => getPaginatedData(options.value))
  }

  async function getPaginatedData(payload: PaginationOptions): Promise<void> {
    loading.value = true

    await getPaginated(payload)
      .then((res: PaginationDto<GameDto>) => {
        response.data = res.data
        response.meta = res.meta
      })
      .finally(() => (loading.value = false))
  }

  watch(
    () => $route.query,
    async (newQuery: LocationQuery): Promise<void> => {
      const parsed = parseQuery<PaginationOptions>(newQuery, defaultOptions)
      await getPaginatedData(parsed)
    }
  )

  return { t, loading, options, response, tableColumns, createGame, updateGame, removeGame, getPaginatedData }
}

export { useGamesTable }
