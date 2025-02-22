$(document).ready(function () {
    // Append modal HTML to the body once
    if ($('#age-verify-modal').length === 0) {
        $('body').append(`
            <div id="age-verify-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center;">
                <div id="age-verify-content" style="background-color:white; padding:20px; border-radius:8px; max-width:400px; width:100%; text-align:center; box-shadow:0 0 10px rgba(0,0,0,0.5);">
                    <h3>Age Verification</h3>
                    <p>Please enter your date of birth:</p>
                    <div style="margin-bottom:10px;">
                        <input type="number" id="dob-month" placeholder="MM" min="1" max="12" style="width:60px;" required>
                        <input type="number" id="dob-day" placeholder="DD" min="1" max="31" style="width:60px;" required>
                        <input type="number" id="dob-year" placeholder="YYYY" min="1900" max="${new Date().getFullYear()}" style="width:80px;" required>
                    </div>
                    <button id="age-verify-submit">Submit</button>
                    <button id="age-verify-cancel" style="margin-left:10px;">Cancel</button>
                </div>
            </div>
        `);
    }

    // Function to calculate age from DOB
    function calculateAge(dob) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    // Function to check if user is already verified
    function isUserVerified(ageLimit) {
        const storedDOB = localStorage.getItem('ageVerifyDOB');
        if (storedDOB) {
            const dob = new Date(storedDOB);
            const age = calculateAge(dob);
            return age >= ageLimit;
        }
        return false;
    }

    // ✅ Suppress modal BEFORE anything else if verified
    const storedDOB = localStorage.getItem('ageVerifyDOB');
    if (storedDOB) {
        $('.age-verify-image').each(function () {
            const container = $(this);
            const ageLimit = parseInt(container.data('age'), 10);
            const imagePlaceholder = container.find('.image-placeholder');
            const verifyButton = container.find('.verify-age-btn');

            const dob = new Date(storedDOB);
            const age = calculateAge(dob);

            if (age >= ageLimit) {
                verifyButton.remove();
                imagePlaceholder.show();
                container.data('verified', true);
                $('#age-verify-modal').hide(); // ✅ Suppress modal explicitly
            }
        });
    }

    // ✅ Continue regular flow for unverified users
    $('.age-verify-image').each(function () {
        const container = $(this);
        const ageLimit = parseInt(container.data('age'), 10);
        const imagePlaceholder = container.find('.image-placeholder');
        const verifyButton = container.find('.verify-age-btn');

        // Click event for non-verified users
        verifyButton.on('click', function () {
            if (container.data('verified')) return;

            if (isUserVerified(ageLimit)) {
                verifyButton.remove();
                imagePlaceholder.show();
                container.data('verified', true);
                $('#age-verify-modal').hide();
                return;
            }

            // ✅ Only show modal if user is unverified
            $('#age-verify-modal').fadeIn();
            $('#dob-month, #dob-day, #dob-year').val('');
            $('#age-verify-modal').data('current-container', container);
        });
    });

    // ✅ Event delegation for Submit button
    $(document).on('click', '#age-verify-submit', function () {
        const month = parseInt($('#dob-month').val(), 10);
        const day = parseInt($('#dob-day').val(), 10);
        const year = parseInt($('#dob-year').val(), 10);
        const container = $('#age-verify-modal').data('current-container');

        if (!container || !container.length) {
            $('#age-verify-modal').fadeOut();
            return;
        }

        const ageLimit = parseInt(container.data('age'), 10);
        const imagePlaceholder = container.find('.image-placeholder');
        const verifyButton = container.find('.verify-age-btn');

        const currentYear = new Date().getFullYear();
        if (!month || !day || !year || year < 1900 || year > currentYear) {
            alert('Please enter a valid date between 1900 and ' + currentYear + '.');
            return;
        }

        const dob = new Date(year, month - 1, day);
        const age = calculateAge(dob);

        if (age >= ageLimit) {
            localStorage.setItem('ageVerifyDOB', dob.toISOString());
            $('#age-verify-modal').fadeOut();
            verifyButton.remove();
            imagePlaceholder.show();
            container.data('verified', true);
        } else {
            $('#age-verify-modal').fadeOut();
        }
    });

    // ✅ Event delegation for Cancel button
    $(document).on('click', '#age-verify-cancel', function () {
        $('#age-verify-modal').fadeOut();
    });
});
