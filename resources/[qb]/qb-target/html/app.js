document.addEventListener("DOMContentLoaded", () => {
    const config = {
        StandardEyeIcon: "fas fa-eye",
        StandardColor: "#ffffff",
        SuccessColor: "#ff8a1f"
    };

    const targetEye = document.getElementById("target-eye");
    const targetLabel = document.getElementById("target-label");

    if (!targetEye || !targetLabel) {
        console.error("[GCR TARGET] target-eye / target-label tidak ditemukan.");
        return;
    }

    let targetOpened = false;

    function nuiCallback(name, data = "") {
        fetch(`https://${GetParentResourceName()}/${name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: typeof data === "string"
                ? data
                : JSON.stringify(data)
        }).catch((error) => {
            console.error(`[GCR TARGET] ${name}:`, error);
        });
    }

    function clearOptions() {
        targetLabel.innerHTML = "";
    }

    function setEye(icon = config.StandardEyeIcon, active = false) {
        targetEye.className = icon;

        targetEye.classList.add("gcr-target-eye");

        if (active) {
            targetEye.classList.add("target-success");
            targetEye.style.color = config.SuccessColor;
        } else {
            targetEye.classList.remove("target-success");
            targetEye.style.color = config.StandardColor;
        }
    }

    function OpenTarget() {
        targetOpened = true;

        clearOptions();

        targetEye.style.display = "flex";
        targetLabel.style.display = "none";

        setEye(config.StandardEyeIcon, false);

        requestAnimationFrame(() => {
            targetEye.classList.add("target-visible");
        });
    }

    function CloseTarget() {
        targetOpened = false;

        clearOptions();

        targetEye.classList.remove(
            "target-visible",
            "target-success"
        );

        targetLabel.classList.remove("target-label-visible");
        targetLabel.style.display = "none";

        setTimeout(() => {
            if (!targetOpened) {
                targetEye.style.display = "none";
            }
        }, 120);
    }

    function createTargetOption(index, itemData) {
        if (!itemData) return;

        const realIndex = Number(index) + 1;

        const targetOption = document.createElement("div");

        targetOption.id = `target-option-${realIndex}`;
        targetOption.className = "target-option";
        targetOption.dataset.targetIndex = realIndex;

        const iconWrapper = document.createElement("span");
        iconWrapper.className = "target-option-icon";

        const icon = document.createElement("i");
        icon.className = itemData.icon || "fas fa-circle";

        iconWrapper.appendChild(icon);

        const content = document.createElement("div");
        content.className = "target-option-content";

        const label = document.createElement("span");
        label.className = "target-option-label";
        label.textContent = itemData.label || "Interaction";

        content.appendChild(label);

        targetOption.appendChild(iconWrapper);
        targetOption.appendChild(content);

        targetLabel.appendChild(targetOption);

        requestAnimationFrame(() => {
            targetOption.classList.add("target-option-visible");
        });
    }

    function renderOptions(options) {
        clearOptions();

        if (!options) {
            targetLabel.style.display = "none";
            return;
        }

        const entries = Object.entries(options);

        if (entries.length === 0) {
            targetLabel.style.display = "none";
            return;
        }

        entries.forEach(([index, itemData]) => {
            createTargetOption(index, itemData);
        });

        targetLabel.style.display = "flex";

        requestAnimationFrame(() => {
            targetLabel.classList.add("target-label-visible");
        });
    }

    function FoundTarget(item) {
        const icon = item.data || config.StandardEyeIcon;

        setEye(icon, true);

        renderOptions(item.options);
    }

    function ValidTarget(item) {
        setEye(config.StandardEyeIcon, true);

        renderOptions(item.data);
    }

    function LeftTarget() {
        clearOptions();

        targetLabel.classList.remove("target-label-visible");
        targetLabel.style.display = "none";

        setEye(config.StandardEyeIcon, false);
    }

    function selectTarget(element) {
        const option = element.closest(".target-option");

        if (!option) return;

        const index = option.dataset.targetIndex;

        if (!index) return;

        option.classList.add("target-option-selected");

        nuiCallback("selectTarget", JSON.stringify(index));

        CloseTarget();
    }

    function handleMouseDown(event) {
        if (event.button === 0) {
            const option = event.target.closest(".target-option");

            if (option) {
                selectTarget(option);
                return;
            }
        }

        if (
            event.button === 2 &&
            !targetLabel.contains(event.target)
        ) {
            LeftTarget();

            nuiCallback("leftTarget");
        }
    }

    function handleKeyDown(event) {
        if (
            event.key === "Escape" ||
            event.key === "Backspace"
        ) {
            CloseTarget();

            nuiCallback("closeTarget");
        }
    }

    window.addEventListener("message", (event) => {
        const data = event.data;

        if (!data || !data.response) return;

        switch (data.response) {
            case "openTarget":
                OpenTarget();
                break;

            case "closeTarget":
                CloseTarget();
                break;

            case "foundTarget":
                FoundTarget(data);
                break;

            case "validTarget":
                ValidTarget(data);
                break;

            case "leftTarget":
                LeftTarget();
                break;
        }
    });

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    CloseTarget();
});