import os
from pathlib import Path

from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.webdriver import WebDriver
from tenacity import sleep

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://nginx")


CERTIFICATE_PATH = Path("assets/certificate.pdf").absolute()
PROFILE_PIC_PATH = Path("assets/profile_pic.jpg").absolute()


def test_tutor_sign_up(driver: WebDriver):
    driver.get(FRONTEND_URL)
    driver.implicitly_wait(3)

    screenshots_dir = "screenshots/test_tutor_sign_up"
    os.makedirs(screenshots_dir, exist_ok=True)

    sleep(0.5)
    driver.save_screenshot(f"{screenshots_dir}/index.png")

    driver.find_element(by=By.XPATH, value='//button[text()="Sign up"]').click()

    sleep(0.5)
    driver.save_screenshot(f"{screenshots_dir}/account_type_selection.png")

    driver.find_element(by=By.XPATH, value='//h3[text()="Tutor"]/..').click()

    # Fill out the tutor sign-up form
    driver.find_element(by=By.NAME, value='first_name').send_keys('John')
    driver.find_element(by=By.NAME, value='last_name').send_keys('Doe')
    driver.find_element(by=By.NAME, value='email').send_keys('johndoe@example.com')
    driver.find_element(by=By.NAME, value='username').send_keys('johndoe')
    driver.find_element(by=By.NAME, value='password').send_keys('Securepassword123!')

    driver.save_screenshot(f"{screenshots_dir}/filled_sign_up_form.png")

    # Click the "Next" button
    driver.find_element(by=By.XPATH, value='//button[text()="Next"]').click()

    # Step 2: Upload profile photo
    photo_input = driver.find_element(by=By.NAME, value='photo_url')
    photo_input.send_keys(str(PROFILE_PIC_PATH))  # Replace with the correct path

    # Select institute
    institute_select = driver.find_element(by=By.NAME, value='university')
    institute_select.click()
    institute_select.find_element(by=By.XPATH, value='//option[text()="KU Leuven"]').click()

    # Select specialty
    specialty_select = driver.find_element(by=By.NAME, value='specialization')
    specialty_select.click()
    specialty_select.find_element(by=By.XPATH, value='//option[text()="Specialty X"]').click()

    # Select SUBJect
    subject_select = driver.find_element(by=By.NAME, value='subject')
    subject_select.click()
    subject_select.find_element(by=By.XPATH, value='//option[text()="Subject X"]').click()

    # Select course number
    course_select = driver.find_element(by=By.NAME, value='current_grade')
    course_select.click()
    course_select.find_element(by=By.XPATH, value='//option[text()="1"]').click()

    # Upload certified document
    certification_input = driver.find_element(by=By.NAME, value='confirmation_file')
    certification_input.send_keys(str(CERTIFICATE_PATH))  # Replace with the correct path

    driver.save_screenshot(f"{screenshots_dir}/filled_qualifications.png")
    driver.find_element(by=By.XPATH, value='//button[text()="Next"]').click()

    #driver.find_element(by=By.XPATH, value='//button[text()="Next"]').click()

    # Add any additional assertions or steps to verify the process
    # sleep(3000)
