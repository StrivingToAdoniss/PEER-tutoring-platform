from django.contrib import admin

from .models import Tutor, User, TutorMore, Student, StudentMore


class TutorMoreInline(admin.TabularInline):
    model = TutorMore
    extra = 1


class StudentMoreInline(admin.TabularInline):
    model = StudentMore
    extra = 1


class TutorAdminApproval(admin.ModelAdmin):
    list_display = ('username', 'email', 'university')
    search_fields = ('email', 'university')
    list_filter = ('university', 'created_at')
    inlines = [TutorMoreInline]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.filter(role=Tutor.base_role).prefetch_related('tutors_more')

    def approve_user(self, request, queryset):
        for tutor in queryset:
            tutor_more = tutor.more
            tutor_more.is_approved = True
            tutor_more.save()

    approve_user.short_description = 'Approve selected users'

    def disapprove_user(self, request, queryset):
        for tutor in queryset:
            tutor.delete()

    disapprove_user.short_description = 'Disapprove selected users'

    actions = ['approve_user', 'disapprove_user']

    def save_model(self, request, obj, form, change):
        if 'is_approved' in form.changed_data:
            pass

        super().save_model(request, obj, form, change)


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'university', 'role')
    search_fields = ('username', 'university', 'email')
    list_filter = ('role', 'created_at', 'university')

    def get_inline_instances(self, request, obj=None):
        inlines = []
        if obj:
            if obj.role == Student.base_role:
                inlines.append(StudentMoreInline(self.model, self.admin_site))
            elif obj.role == Tutor.base_role:
                inlines.append(TutorMoreInline(self.model, self.admin_site))
        return inlines


admin.site.register(Tutor, TutorAdminApproval)
admin.site.register(User, UserAdmin)
