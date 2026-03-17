from django.core.management.base import BaseCommand

from octofit_tracker.models import Activity, Leaderboard, Team, User, Workout


class Command(BaseCommand):
    help = 'octofit_db 데이터베이스에 테스트 데이터를 입력합니다.'

    def handle(self, *args, **options):
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()

        marvel = Team.objects.create(name='marvel team')
        dc = Team.objects.create(name='dc team')

        heroes = [
            ('Iron Man', 'ironman@octofit.com', marvel, 950),
            ('Spider-Man', 'spiderman@octofit.com', marvel, 910),
            ('Captain Marvel', 'captainmarvel@octofit.com', marvel, 890),
            ('Batman', 'batman@octofit.com', dc, 940),
            ('Superman', 'superman@octofit.com', dc, 980),
            ('Wonder Woman', 'wonderwoman@octofit.com', dc, 900),
        ]

        for name, email, team, points in heroes:
            user = User.objects.create(name=name, email=email, team=team)
            Activity.objects.create(
                user=user,
                activity_type='HIIT',
                duration_minutes=45,
                calories_burned=500,
            )
            Activity.objects.create(
                user=user,
                activity_type='Strength Training',
                duration_minutes=40,
                calories_burned=420,
            )
            Leaderboard.objects.create(user=user, points=points)
            Workout.objects.create(
                user=user,
                title=f'{name} Power Circuit',
                focus='Full Body',
                difficulty='Intermediate',
            )

        self.stdout.write(self.style.SUCCESS('테스트 데이터 적재가 완료되었습니다.'))
