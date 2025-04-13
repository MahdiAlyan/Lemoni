from django.http import JsonResponse
from Lemoni.models import Images
from django.core.paginator import Paginator
from django.urls import path
from django.shortcuts import render


def images_dashboard(request):
    paginator = Paginator(all_images(), 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'Images/media_dashboard.html', {'page_obj': page_obj})


def all_images():
    images = Images.objects.all().order_by('-uploaded_at')
    return images


def images_data(request):
    # parse parameters from request
    page_index = request.GET.get('')
    page_size = request.GET.get('')

    images_list = all_images()
    records_total = images_list.count()

    images_dtos = []
    for image_obj in images_list:
        images_dtos.append(
            {
                'id': image_obj.id,
                'description': image_obj.description,

            }
        )

    data = {
        {
            "draw": 1,
            "recordsTotal": records_total,
            "recordsFiltered": records_total,
            "data": images_dtos
        }
    }

    return JsonResponse(data)


def upload_images(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES.get('file')
        image = Images(image_file=file)
        image.save()
        return JsonResponse({'message': 'Images uploaded successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)


urlpatterns = [
    path('dashboard', images_dashboard, name='images_dashboard'),
    path('data', images_data, name='images_data'),
    path('upload', upload_images, name='upload_images'),
]
