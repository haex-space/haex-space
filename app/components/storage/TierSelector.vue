<script setup lang="ts">
import { Check, ChevronsUpDown } from "lucide-vue-next";
import type { StorageTier } from "~/stores/storage";
import { formatBytes, formatPrice } from "~/utils/format";

const props = defineProps<{
  tiers: StorageTier[];
  currentTierSlug?: string;
  loading?: boolean;
}>();

const { t } = useI18n();

const open = ref(false);

// Current tier info
const currentTier = computed(() =>
  props.tiers.find((tier) => tier.slug === props.currentTierSlug)
);
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div
        class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
      />
    </div>

    <div v-else class="space-y-4">
      <!-- Current plan display -->
      <div class="flex items-center justify-between rounded-lg border border-primary bg-primary/5 p-4">
        <div>
          <p class="text-sm text-muted-foreground">{{ t("storage.tiers.currentPlan") }}</p>
          <p class="font-medium text-lg">
            {{ currentTier?.name || "Free" }}
            <span class="text-muted-foreground font-normal">
              ({{ formatBytes(currentTier?.quotaBytes || 10737418240, 0) }})
            </span>
          </p>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check class="h-5 w-5" />
        </div>
      </div>

      <!-- Tier selector dropdown -->
      <div class="space-y-2">
        <label class="text-sm font-medium">{{ t("storage.tiers.upgradeTo") }}</label>
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-full justify-between"
            >
              {{ t("storage.tiers.selectPlan") }}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-full p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="tier in tiers"
                    :key="tier.id"
                    :value="tier.slug"
                    :disabled="tier.slug === currentTierSlug"
                    class="flex items-center justify-between"
                    @select="open = false"
                  >
                    <div class="flex items-center gap-2">
                      <Check
                        v-if="tier.slug === currentTierSlug"
                        class="h-4 w-4 text-primary"
                      />
                      <div v-else class="w-4" />
                      <span>{{ tier.name }}</span>
                      <span class="text-muted-foreground text-sm">
                        ({{ formatBytes(tier.quotaBytes, 0) }})
                      </span>
                    </div>
                    <span class="text-sm text-muted-foreground">
                      {{ formatPrice(tier.priceMonthlyEuroCents, t("storage.tiers.free")) }}
                    </span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <!-- Coming soon notice -->
      <p class="text-sm text-muted-foreground text-center">
        {{ t("storage.tiers.comingSoonHint") }}
      </p>
    </div>
  </div>
</template>
