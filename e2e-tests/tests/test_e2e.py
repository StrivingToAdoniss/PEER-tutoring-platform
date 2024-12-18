import os
from pathlib import Path

from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.webdriver import WebDriver
from tenacity import sleep

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://nginx")
BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000")


CERTIFICATE_PATH = Path("assets/certificate.pdf").absolute()
PROFILE_PIC_PATH = Path("assets/profile_pic.jpg").absolute()


def test_tutor_2e2(driver: WebDriver):
    tutor_sign_up(driver)
    tutor_log_in(driver, "impossible_login")
    admin_approve_tutor(driver)
    driver.get(FRONTEND_URL)
    tutor_log_in(driver, "possible_login")
    tutor_log_out(driver)


def tutor_sign_up(driver: WebDriver):
    driver.get(FRONTEND_URL)
    driver.implicitly_wait(3)

    screenshots_dir = "screenshots/test_tutor_sign_up"
    os.makedirs(screenshots_dir, exist_ok=True)

    sleep(0.5)
    driver.save_screenshot(f"{screenshots_dir}/index.png")

    driver.find_element(by=By.XPATH, value='//button[text()="Sign up"]').click()

    driver.save_screenshot(f"{screenshots_dir}/account_type_selection.png")

    driver.find_element(by=By.XPATH, value='//h3[text()="Tutor"]/..').click()

    # Fill out the tutor sign-up form
    driver.find_element(by=By.NAME, value='first_name').send_keys('Jenny')
    driver.find_element(by=By.NAME, value='last_name').send_keys('Doe')
    driver.find_element(by=By.NAME, value='email').send_keys('jenydoe@example.com')
    driver.find_element(by=By.NAME, value='username').send_keys('JennyDoe11')
    driver.find_element(by=By.NAME, value='password').send_keys('Securepassword1234!!!')

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
    certification_input.send_keys(str(CERTIFICATE_PATH))

    driver.save_screenshot(f"{screenshots_dir}/filled_qualifications.png")
    driver.find_element(by=By.XPATH, value='//button[text()="Register"]').click()


def tutor_log_in(driver: WebDriver, name):
    screenshots_dir = "screenshots/test_tutor_log_in"
    os.makedirs(screenshots_dir, exist_ok=True)

    sleep(0.5)
    driver.save_screenshot(f"{screenshots_dir}/login.png")

    driver.find_element(by=By.XPATH, value='//button[text()="Log in"]').click()
    driver.find_element(By.XPATH, '//input[@type="password"]').send_keys('Securepassword1234!!!')
    driver.find_element(By.XPATH, '//input[@type="email"]').send_keys('jenydoe@example.com')

    driver.find_element(By.XPATH, '//button[@type="submit" and contains(@class, "login-button")]').click()
    driver.save_screenshot(f"{screenshots_dir}/{name}.png")


def admin_approve_tutor(driver: WebDriver):
    screenshots_dir = "screenshots/test_admin_approve_tutor"
    os.makedirs(screenshots_dir, exist_ok=True)

    driver.get(f"{BACKEND_URL}/admin")
    driver.implicitly_wait(3)

    driver.find_element(By.XPATH, '//input[@id="id_username"]').send_keys('admin@gmail.com')
    driver.find_element(By.XPATH, '//input[@id="id_password"]').send_keys('Django@2004')

    driver.save_screenshot(f"{screenshots_dir}/admin_login.png")

    driver.find_element(By.XPATH, '//input[@type="submit" and @value="Log in"]').click()

    driver.find_element(By.XPATH, '//a[@href="/admin/accounts/tutor/"]').click()
    driver.find_element(By.XPATH, '//a[text()="JennyDoe11"]').click()

    driver.save_screenshot(f"{screenshots_dir}/list_of_tutors.png")

    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    driver.find_element(By.XPATH, '//a[starts-with(text(), "images/profile_pic")]').click()
    driver.back()

    driver.find_element(By.XPATH, '//a[starts-with(@href, "/media/confirmation_files/certificate")]').click()
    driver.back()
    driver.back()

    checkbox = driver.find_element(By.XPATH,
                                   '//th[@class="field-username"]/a[text()="JennyDoe11"]/../preceding-sibling::td[@class="action-checkbox"]/input')
    if not checkbox.is_selected():
        checkbox.click()

    action_dropdown = driver.find_element(By.NAME, 'action')
    action_dropdown.click()

    action_dropdown.find_element(By.XPATH, '//option[text()="Approve selected users"]').click()

    driver.save_screenshot(f"{screenshots_dir}/approve_tutor.png")

    driver.find_element(By.XPATH, '//button[@type="submit" and @name="index" and @value="0"]').click()


def tutor_log_out(driver: WebDriver):
    screenshots_dir = "screenshots/test_tutor_log_out"
    os.makedirs(screenshots_dir, exist_ok=True)

    driver.find_element(By.XPATH, '//img[@class="logout-button" and @alt="Log out"]').click()
    driver.save_screenshot(f"{screenshots_dir}/logout.png")


