from django.contrib.auth import login
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, UserLoginSerializer


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny, ]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UserSerializer(
            data=request.data, context={
                'request': request})
        if not (serializer.is_valid(raise_exception=True)
                and not request.user.is_authenticated):
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
        user = serializer.create(request.data)
        if user:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            "User can not be created",
            status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny, ]

    def post(self, request):
        response_data = {}
        serializer = UserLoginSerializer(data=request.data)
        if not (serializer.is_valid(raise_exception=True)
                and not request.user.is_authenticated):
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)

        user = serializer.authenticate_user(request.data)
        if user and self.check_tutor_is_approved(user=user):
            token = RefreshToken.for_user(user)
            response_data['tokens'] = {
                'refresh': str(token), 'access': str(token.access_token)
            }
            login(request, user)
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(
            "Login is not succesful",
            status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def check_tutor_is_approved(user):
        if user.role == 'TUTOR' and not user.tutors_more.is_approved:
            raise PermissionDenied(
                "Wait until administration approves your application")
        return True


class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': "You have successfully logged out"},
                            status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
