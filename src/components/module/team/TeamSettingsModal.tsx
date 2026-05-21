import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SKILL_LEVELS } from '@/constants/team';
import { teamSettingsSchema, TeamSettingsValues } from '@/lib/schemas/teamSchema';
import { TeamData } from '@/types/team';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';

interface TeamSettingsModalProps {
  open: boolean;
  onClose: () => void;
  team: TeamData;
  onSave: (values: TeamSettingsValues) => void;
}

function TeamSettingsModal({ open, onClose, team, onSave }: TeamSettingsModalProps) {
  const resolver = zodResolver(teamSettingsSchema) as Resolver<
    TeamSettingsValues,
    any,
    TeamSettingsValues
  >;

  const defaultRequirement = team.min_requirement ?? team.skill_level;

  const form = useForm<TeamSettingsValues, any, TeamSettingsValues>({
    resolver,
    defaultValues: {
      member_slots: team.member_slots,
      min_requirement: defaultRequirement,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      member_slots: team.member_slots,
      min_requirement: team.min_requirement ?? team.skill_level,
    });
  }, [form, open, team]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Team Settings</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="member_slots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-wider uppercase">
                    Member Slots
                  </FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={50} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="min_requirement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-wider uppercase">
                    Level Requirement
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full!">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SKILL_LEVELS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="min_requirement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-wider uppercase">
                    Level Requirement
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full!">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SKILL_LEVELS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Settings</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default TeamSettingsModal;
